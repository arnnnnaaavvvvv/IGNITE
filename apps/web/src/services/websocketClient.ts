export class SafeTrailWebSocketClient {
  private socket: WebSocket | null = null;
  private tripId: string;
  private onMessageCallback: (data: any) => void;
  private onStatusCallback: (connected: boolean) => void;
  private reconnectTimer: any = null;

  constructor(
    tripId: string,
    onMessage: (data: any) => void,
    onStatusChange: (connected: boolean) => void
  ) {
    this.tripId = tripId;
    this.onMessageCallback = onMessage;
    this.onStatusCallback = onStatusChange;
  }

  connect() {
    try {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsHost = window.location.port === '3000' ? '127.0.0.1:8000' : window.location.host;
      const url = `${wsProtocol}//${wsHost}/api/v1/ws/alerts/${this.tripId}`;

      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log(`[WebSocket] Connected to live hazard mesh: ${this.tripId}`);
        this.onStatusCallback(true);
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessageCallback(data);
        } catch (e) {
          console.error('[WebSocket] Failed to parse message:', e);
        }
      };

      this.socket.onclose = () => {
        this.onStatusCallback(false);
        this.scheduleReconnect();
      };

      this.socket.onerror = () => {
        this.onStatusCallback(false);
        this.socket?.close();
      };
    } catch (err) {
      console.error('[WebSocket] Connection initialization error:', err);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (!this.reconnectTimer) {
      this.reconnectTimer = setTimeout(() => {
        console.log('[WebSocket] Attempting auto-reconnect to live mesh...');
        this.connect();
      }, 5000);
    }
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
