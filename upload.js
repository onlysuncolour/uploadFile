$(function() {
  checkLogin();
})

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
      // debugger;
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

var checkLogin = function() {
  // debugger;
  $.ajax({
    url: '/checkLogin',
    type: 'GET',
    success: function(data) {
      // debugger;
      if (data.success) {
        if (data.username == 'root') {
          $('#manageUsersButton').css('display', 'block');
        } else {
          $('#changePasswordButton').css('display', 'block');
        }
        getFileList();
      } else {
        location.href = 'login'
      }
    },
    error : function(err) {
      location.href = 'login'
    }
  })
}

var showChangePassword = function() {
  var changePasswordTab = $('#changePasswordTab')[0];
  if (changePasswordTab.style.display == 'none') {
    $('#changePasswordTab').css('display', 'block');
  } else {
    $('#changePasswordTab').css('display', 'none');
  }
}

var showManageUsers = function() {
  var manageUsersTab = $('#manageUsersTab')[0];
  if (manageUsersTab.style.display == 'none') {
    $('#manageUsersTab').css('display', 'block');
  } else {
    $('#manageUsersTab').css('display', 'none');
  }
}

var changePassword = function () {
  var passwords = {};
  passwords['password'] = $('#password')[0].value,
  passwords['newpassword'] = $('#newpassword')[0].value;
  if (!passwords['password'] == null || !passwords['newpassword'] == undefined) {
    alert('请输入完整的原密码，新密码！');
    return;
  }
  $.ajax({
    url: '/changePassword',
    type: 'POST',
    data: passwords,
    success: function(data) {
      alert('操作成功')
    },
    error: function(err) {
      alert('操作失败');
    }
  })
}

var manageUsers = function () {
  var user = {}
  user['username'] = $('#username')[0].value,
  user['upassword'] = $('#upassword')[0].value;
  if (!user['username'] == null || !user['upassword'] == undefined) {
    alert('请输入完整的用户名、密码！');
    return;
  }
  $.ajax({
    url: '/manageUsers',
    type: 'POST',
    data: user,
    success: function(data) {
      alert('操作成功')
    },
    error: function(err) {
      alert('操作失败');
    }
  })
}
