/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2015 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    15/11/19
 */

export default class extends THINK.Behavior {
    init(http) {
        this.http = http;
    }

    async run(content) {
        if (!C('token_on')) {
            return content;
        }
        let token = await this.getToken();
        let key = C('token_key');
        let name = C('token_name');
        if (content.indexOf(key) > -1) {
            return content.replace(key, token);
        } else if (content.indexOf('</form>') > -1) {
            return content.replace(/<\/form>/g, '<input type="hidden" name="' + name + '" value="' + token + '" /></form>');
        } else {
            return content.replace(/<\/head>/g, '<meta name="' + name + '" content="' + token + '" /></head>');
        }
    }

    async getToken(){
        let tokenName = C('token_name');
        let value = await this.http.session(tokenName);
        if (value) {
            return value;
        }
        let token = this.http.cookieUid(32);
        return this.http.session(tokenName, token);
    }
}