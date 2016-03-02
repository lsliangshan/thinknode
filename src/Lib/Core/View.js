/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2015 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    15/11/26
 */
import base from './Base';

export default class extends base{

    init(http){
        this.http = http;
        this.tVar = {};
    }

    /**
     * 赋值
     * @param  {[type]} name  [description]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    assign(name, value){
        if (name === undefined) {
            return this.tVar;
        }
        if (isString(name) && arguments.length === 1) {
            return this.tVar[name];
        }
        if (isObject(name)) {
            for (var key in name) {
                this.tVar[key] = name[key];
            }
        } else {
            this.tVar[name] = value;
        }
    }

    /**
     * 输出模版
     * @param  {[type]} templateFile [description]
     * @param  {[type]} charset      [description]
     * @param  {[type]} contentType  [description]
     * @param  {[type]} content      [description]
     * @return {[type]}              [description]
     */
    async display(templateFile, charset, contentType){
        if(this.http.isend){
            return E('this http has being end');
        }
        await T('view_init', this.http, [templateFile, this.tVar]);
        let content = await this.fetch(templateFile);
        content = await this.render(content, charset, contentType);
        return T('view_end', this.http, [content, this.tVar]);
    }

    /**
     * 渲染模版
     * @param  {[type]} content     [description]
     * @param  {[type]} charset     [description]
     * @param  {[type]} contentType [description]
     * @return {[type]}             [description]
     */
    render(content, charset, contentType){
        if(!this.http.typesend){
            charset = charset || C('encoding');
            contentType = contentType || C('tpl_content_type');
            this.http.header('Content-Type', contentType + '; charset=' + charset);
        }
        if (C('show_exec_time')) {
            this.http.sendTime();
        }
        return this.http.echo(content || '', charset || C('encoding'));
    }

    /**
     * 获取模版内容
     * @param  {[type]} templateFile [description]
     * @param  {[type]} content      [description]
     * @return {[type]}              [description]
     */
    async fetch(templateFile){
        let tpFile = templateFile;
        if (isEmpty(templateFile) || !isFile(templateFile)) {
            tpFile = this.http.templateFile;
            if(!isFile(tpFile)){
                return E(`can\'t find template file ${tpFile}`);
            }
        }
        for(let v in this.tVar){
            if(isPromise(this.tVar[v])){
                this.tVar[v] = await this.tVar[v];
            }
        }
        let content = await T('view_parse', this.http, {'var': this.tVar, 'file': tpFile});
        return T('view_filter', this.http, content);
    }
}