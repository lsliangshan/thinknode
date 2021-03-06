/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2015 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    15/12/9
 */
import url from 'url';
import base from '../../Core/Base';

export default class extends base{

    init(options){
        this.server = options.server;
        this.app = options.app;
    }

    /**
     * run
     * @return {} []
     */
    run(){
        let socketio = require('socket.io');
        let io = socketio(this.server);
        this.io = io;
        //Sets the path v under which engine.io and the static files will be served. Defaults to /socket.io.
        if(THINK.config('websocket_path')){
            io.path(THINK.config('websocket_path'));
        }
        if(THINK.config('websocket_allow_origin')){
            io.origins(THINK.config('websocket_allow_origin'));
        }
        let messages = THINK.config('websocket_messages');
        let msgKeys = Object.keys(messages);
        let open = messages.open;
        delete messages.open;
        let close = messages.close;
        delete messages.close;

        let self = this;
        io.on('connection', socket => {

            //open connection
            if(open){
                self.message(open, undefined, socket);
            }
            //listen disonnection event
            if(close){
                socket.on('disconnect', () => {
                    self.message(close, undefined, socket);
                });
            }

            //listen list of message type
            msgKeys.forEach(msgKey => {
                socket.on(msgKey, msg => {
                    self.message(messages[msgKey], msg, socket);
                });
            });
        });
    }

    /**
     * emit socket data
     * @param  {String} event []
     * @param  {Mixed} data  []
     * @return {}       []
     */
    emit(event, data){
        return this.socket.emit(event, data);
    }

    /**
     * broadcast socket data
     * @param  {String} event       []
     * @param  {Mixed} data        []
     * @param  {Boolean} containSelf []
     * @return {}             []
     */
    broadcast(event, data, containSelf){
        if(containSelf){
            this.io.sockets.emit(event, data);
        }else{
            this.socket.broadcast.emit(event, data);
        }
    }

    /**
     * deal message
     * @param  {String} url  []
     * @param  {Mixed} data []
     * @return {}      []
     */
    async message(url, data, socket){
        let request = socket.request;
        if(url[0] !== '/'){
            url = `/${url}`;
        }
        request.url = url;
        let http = await (THINK.Http).run(request, THINK.extend({}, request.res), 'SOCKET');
        http.pathname = url;
        http.method = 'ws';
        http.url = url;
        http.data = data;
        http.isWebSocket = true;
        http.socket = socket;
        http.io = this.io;

        http.socketEmit = this.emit;
        http.socketBroadcast = this.broadcast;

        return this.app.exec(http).then(() => THINK.statusAction(http, 200)).catch(err => {
            return THINK.statusAction(http, 500, err);
        });
    }

    /**
     * check origin allowed
     * @param  {String}  origin []
     * @return {Boolean}        []
     */
    isOriginAllowed(origin){
        let allowOrigins = THINK.config('websocket_allow_origin');
        if (!allowOrigins) {
            return true;
        }
        let info = url.parse(origin);
        let hostname = info.hostname;
        if (THINK.isString(allowOrigins)) {
            return allowOrigins === hostname;
        }else if (THINK.isArray(allowOrigins)) {
            return allowOrigins.indexOf(hostname) > -1;
        }else if (THINK.isFunction(allowOrigins)) {
            return allowOrigins(hostname, info);
        }
        return false;
    }
}
