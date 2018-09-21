var express = require('express');
var router = express.Router();
var request = require('request');
var qs = require('querystring')

const CLIENT = {
  'ADFGHSX123': '建站',
  'ADFGHSX456': '卡券',
}

const PERMISSIONS = {
  'read': [
      '访问用户信息',
      '访问API接口'
  ]
}

let client_authorize = {}

// 授权页
router.get('/auth/authorize', function(req, res) {
  let {
      response_type,
      client_id,
      redirect_uri,
      scope
  } = req.query;

  let client = CLIENT[client_id];
  let permissions = PERMISSIONS[scope];
    client_authorize.response_type = response_type;
    client_authorize.redirect_uri = redirect_uri;

  res.render('authorize', {
    title: '授权页',
    client: client,
    permissions: permissions
  })
});

// 用户同意授权
router.get('/auth/agree', function(req, res) {
  let code = '';
  let error = 'access_deined'
  if (client_authorize.response_type === 'token') {
    code = `request_ADFGHSX123`;
    res.redirect(`${client_authorize.redirect_uri}?code=${code}`)
  } else {
    res.redirect(`${client_authorize.redirect_uri}?error=${error}`)
  }
});

// 用户拒绝授权
router.get('/auth/refuse', function(req, res) {
    let error = 'access_deined'
    res.redirect(`${client_authorize.redirect_uri}?error=${error}`)
});

// 下发access_token
router.get('/auth/token', function (req, res) {
    let {
        grant_type,
        code,
        client_id,
        redirect_uri
    } = req.query;
    let error = 'access_deined';
    console.log(code)
    if ( client_id === 'ADFGHSX123' && code === 'request_ADFGHSX123') {
        let params = {
            'access_token': 'access001',
            'client_id': 'ADFGHSX123',
            'expires_in': 3600,
            'scope': 'read'
        }
        let url = 'http://localhost:3001/users/access_token?' + qs.stringify(params)
        request(url, function (err, httpResponse, body) {
            if(err){
                res.json({
                    message: '资源服务器拒绝访问'
                })
            }
            var data = JSON.parse(body)
            if(data.code === 0) {
                res.json({
                    'access_token': 'access001',
                    'token_type': 'text',
                    'expires_in': 3600,
                    'refresh_token': 'refresh001',
                    'scope': 'read'
                })
            } else [
                res.json({
                    message: 'access_token下发失败'
                })
            ]
        })
    } else {
        res.redirect(`${redirect_uri}?error=${error}`)
    }
});

module.exports = router;
