$(function() {
  if (!!window.localStorage.username && !! window.localStorage.password) {
    $('#username')[0].value = window.localStorage.username,
    $('#password')[0].value = window.localStorage.password;
    user['username'] = window.localStorage.username,
    user['password'] = window.localStorage.password;
    $('#remember')[0].checked = true;
  }
})


var user = {
  'username': null,
  'password': null
}

var login = function() {
  user['username'] = $('#username')[0].value,
  user['password'] = $('#password')[0].value;
  if (!user['username'] == null || !user['password'] == undefined) {
    alert('请输入完整的用户名、密码！');
    return;
  }
  window.localStorage.username = user.username;
  if($('#remember')[0].checked) {
    window.localStorage.password = user.password;
  }
  $.ajax({
    url: '/userLogin',
    type: 'POST',
    data: user,
    success: function(data) {
      // debugger;
      location.href = 'main'
    },
    error: function(err) {
      alert('用户名或密码错误！');
    }
  })
}
