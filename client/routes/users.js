const express = require('express');
const router = express.Router();
const request  = require('request');
const qs = require('querystring')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('http://localhost:3003/oauth2/auth/authorize?response_type=token&client_id=ADFGHSX123&redirect_uri=http://localhost:3002/users/oauth/callback&scope=read')
});

router.get('/oauth/callback', function (req, res) {
    let { code, error } = req.query;
    if (error === 'access_deined') {
        res.render('index', {
            title: '建站',
            data: {
                message: '用户拒绝授权访问相关信息'
            }
        })
    } else {
        let params = {
            'grant_type': 'authorization_code',
            'code': code,
            'client_id': 'ADFGHSX123',
            'redirect_uri': 'http://localhost:3002/users/oauth/callback'
        }
        let url = 'http://localhost:3003/oauth2/auth/token?' + qs.stringify(params);
        request(url, function (err, httpResponse, body) {
            if(err) {
                return console.error('request failed:', error);
            }

            var data = JSON.parse(body)
            if(data.access_token && data.expires_in <= 3600){
                console.log('data',data)
                let params = {
                    'access_token': data.access_token,
                    'client_id': 'ADFGHSX123',
                    'expires_in': data.expires_in,
                    'scope': data.scope
                }
                let sourceUrl = 'http://localhost:3001/users/info?' + qs.stringify(params);
                request(sourceUrl, function (err, httpResponse, resource) {
                    if(err) {
                        return console.error('request failed:', error);
                    }
                    console.log('resource',resource)
                    res.render('index', {
                        title: '建站',
                        data: JSON.parse(resource)
                    })
                })
            } else {
                res.render('index', {
                    title: '建站',
                    data: {
                        message: '令牌过期或不允许访问'
                    }
                })
            }
        })
    }
})


module.exports = router;
