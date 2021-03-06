
import * as socketio from 'socket.io-client';

class APISocket {
  private socket: SocketIOClient.Socket;
  private readonly server: string;
  private connected: boolean;

  constructor () {
    const host = 'https://api.bitwave.tv';

    this.server = process.env['BMS_SERVER'] || 'stream.bitrave.tv';
    this.connected = false;

    this.socket = socketio( host, { transports: ['websocket'] } );

    this.socket.on( 'connect',     () => this.onServerConnect() );
    this.socket.on( 'disconnect',  () => this.onServerDisconnect() );
  }

  onServerConnect () {
    this.connected = true;
    console.log( `Ingestion server connected to API server socket.` );
  }

  onServerDisconnect () {
    this.connected = false;
  }

  onConnect ( streamer ) {
    if ( !this.connected ) return;

    const data = {
      streamer: streamer,
      server: this.server,
    };

    this.socket.emit( 'ingestion.streamer.connect', data );
    console.log( `${streamer} connecting to API server socket` );
  }

  onUpdate ( streamer, stats ) {
    if ( !this.connected ) return;

    const data = {
      streamer: streamer,
      data: stats,
    };

    this.socket.emit( 'ingestion.streamer.update', data );
  }

  onDisconnect( streamer ) {
    if ( !this.connected ) return;

    const data = {
      streamer: streamer,
      server: this.server,
    };

    this.socket.emit( 'ingestion.streamer.disconnect', data );
    console.log( `${streamer} disconnecting API server socket` );
  }

}

export const SocketClient = new APISocket();
