$(function() {
  if (!!window.localStorage.username && !! window.localStorage.password) {
    $('#username')[0].value = window.localStorage.username,
    $('#password')[0].value = window.localStorage.password;
    user['username'] = window.localStorage.username,
    user['password'] = window.localStorage.password;
    $('#remember')[0].checked = true;
  }
})

var isLogined = false;
if (location.pathname != '/login') {//
  location.href = 'login'
}
console.log(isLogined)

var user = {
  'username': null,
  'password': null
}

var login = function() {
  user['username'] = $('#username')[0].value,
  user['password'] = $('#password')[0].value;
  if (user['username'] == null || user['username'] == undefined || user['password'] == null || user['password'] == undefined) {
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
      isLogined = true;
      location.href = 'main'
    },
    error: function(err) {
      alert('用户名或密码错误！');
    }
  })
}

var changePassword = function() {
  user['username'] = window.localStorage.username ;
  user['password'] = $('#newPassword')[0].value;
  $.ajax({
    url: '/changePassword',
    type: 'POST',
    data: user,
    success: function(data) {
      alert('修改成功');
    },
    error: function(err) {
      alert('操作失败。');
    }
  })
}

var upload = function() {
  var formData = new FormData($( "#uploadForm" )[0]);
   $.ajax({
        url: '/upload' ,
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            var year = $("#year")[0].value,
                month = $('#month')[0].value;
            var fileName = year + "年" + month + "月.pdf";
            var message = "上传成功，文件名为：" + fileName;
            showMessage(message);
            getFileList();
        },
        error: function (err) {
          showMessage("上传失败，请重试！");
        }
   });
}

var showMessage = function(message) {
  $('#showMessage').empty();
  $('#showMessage').append('<span> ' + message + '</span>' );
}

var getFileList = function() {
  $.ajax({
    url: '/showList',
    type: 'GET',
    success: function(data) {
      var list = [];
      for (var i = 0; i < data.fileList.length; i++) {
        if(data.fileList[i].slice(data.fileList[i].length-4, data.fileList[i].length) == ".pdf") {
          list.push(data.fileList[i]);
        }
      }
      $('#fileList').empty();
      $('#fileList').append('<ul><span> 已经存在的文件有：</span>' );
      for (var i = 0; i < list.length; i++) {
        list[i]
        $('#fileList').append('<li> <span>' + list[i] + '</span>' + '<button onclick="unlinkFile(' + "'"+ list[i] + "'"+')"> 移除文件</button></li>' );
      }
      $('#fileList').append('</ul>' );
    },
    error: function(err) {
      debugger;
      alert(err);
    }
  })
}
var unlinkFile = function(fileName) {
  $.ajax({
    url: '/unlinkFile',
    type: 'GET',
    data: {fileName: fileName},
    charset:'utf-8',
    success: function(data) {
      if (data.success) {
        showMessage("删除文件成功！");
      } else {
        showMessage("删除文件失败，请重试");

      }
    },
    error : function(err) {
      showMessage("删除文件失败，请重试");
    }
  })
}


getFileList();
