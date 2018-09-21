var express = require('express');
var router = express.Router();
var access_token = 'access001';

let ACCESS = {}

router.get('/info', function(req, res, next) {
  let {
      access_token,
      client_id,
      expires_in,
      scope
  } = req.query;
  if(client_id === ACCESS['client_id'] && access_token === ACCESS['access_token'] && expires_in <= ACCESS['expires_in']) {
    if (scope === 'read') {
      res.json({
          userId: '13344343',
          userName: '默凡',
          headerLogo: 'https://avatars0.githubusercontent.com/u/9158841?s=400&u=a49da4e65c7ca31449f8bcf82dc5759f40dc6e6b&v=4',
          age: 26,
          apiList: ['shareInfo', 'editVangoghData', 'getPoppupList']
      })
    }
  }
});

router.get('/access_token', function (req, res) {
    let {
        access_token,
        client_id,
        expires_in,
        scope
    } = req.query
    if (access_token && expires_in && client_id && scope) {
        ACCESS['access_token'] = access_token;
        ACCESS['client_id'] = client_id;
        ACCESS['expires_in'] = expires_in;
        ACCESS['scope'] = scope;
        res.json({
            code: 0,
            message: 'copy that！'
        })
    } else {
        res.json({
            code: -1,
            message: 'access deined'
        })
    }
})

module.exports = router;
