angular.module('myapp', ['ionic', 'firebase'])
  .controller('mycontroller', function ($scope, $http, $firebaseObject) {
    $scope.model = {};
    //$scope.redLocation = "";
    //$scope.greenLocation = "";

    $scope.initializeFirebase = function () {
      var ref = new Firebase("https://a-7ffb3.firebaseio.com/Game/WifiGame/");
      $scope.board = $firebaseObject(ref);
      var ref1 = new Firebase("https://a-7ffb3.firebaseio.com/Game/WifiGame/0f572fc5-8578-45fe-9286-b9d2283c20b8/tasks/status");
      $scope.board1 = $firebaseObject(ref1);
      $scope.board1.boardStatus = " ";
      $scope.board1.tossValue = " ";
      $scope.board1.$save();
    }

    $scope.sKey = "123";
    boardStatusTemp = null;
    if ($scope.sKey != null) {
      $scope.initializeFirebase();
    }

    $scope.move = function (project, event) {
      if (!project.hasOwnProperty("tasks")) {
        project.tasks = {};
      }
      boardStatusTemp=project.tasks["status"].boardStatus;
      var color=project.tasks["status"].tossValue;
      if(color==" ")
      {
        color="green";
      }
      boardStatusTemp += event.target.id + ":"+ color+",";
      document.getElementById(event.target.id).style.background = color;
      //project.tasks["status"] = { tossValue: project.task.tossValue, boardStatus: project.task.boardStatus };
      if(color=="green")
      {
        color="red";
      }
      else if(color=="red")
      {
        color="green";
      }
      project.tasks["status"] = { tossValue: color, boardStatus: boardStatusTemp };
      delete project.task;
      $scope.board.$save();      

     
    }

  })

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })