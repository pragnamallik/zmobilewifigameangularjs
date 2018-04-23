// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('myapp', ['ionic', 'firebase'])
  .controller('mycontroller', function ($scope, $http, $firebaseObject) {
    
    //$http.get('http://rest-service.guides.spring.io/greeting').
    $http.get('https://whispering-woodland-9020.herokuapp.com/getAllBooks').    
    then(function(response) {
        $scope.data = response.data;
    });

    var dbSize = 5 * 1024 * 1024; // 5MB
    $scope.webdb = {};
    // open database
    var db = openDatabase("IndianFestivals", "1", "Todo manager", dbSize);

    //create table to use
    db.transaction(function (tx) {
      tx.executeSql("CREATE TABLE IF NOT EXISTS " +
        "UserCredentials(username TEXT PRIMARY KEY, password TEXT)", [],
        function () {
          console.log("Created");
        },
        function () {
          console.log("Create failure")
        }
      );
    });

    $scope.login = function () {
      db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM UserCredentials where username=? and password=?",
          [$scope.username, $scope.password],
          function (tx, rs) {
            for (var i = 0; i < rs.rows.length; i++) {
              document.cookie = "LoginName=" + $scope.username;
              window.location = "homepage.html";
              break;
            }
            $scope.loginerror = "Invalid Username/Password";
            $scope.$apply();
          },
          function (err) {
            console.log("Read failed");
          });
      }
      );
    }
    $scope.playMusic = function () {
      var audio = document.getElementById("audio");
      audio.play();
    }

    $scope.notify = function () {
      cordova.plugins.notification.local.schedule({
        text: "People commented on Indian Festivals",
        every: 1
      });
    }

    $scope.scan = function () {
      cordova.plugins.barcodeScanner.scan(
        function (result) {
          var s = "BarCode: " + result.text + "<br/>" +
            "Format: " + result.format + "<br/>";
          //"Cancelled: " + result.cancelled;
          //resultDiv.innerHTML = s;
          document.getElementById("scanresults").innerHTML = s;
          //alert(s);
        },
        function (error) {
          document.getElementById("scanresults").innerHTML = "INVALID CODE";
        },
        {
          preferFrontCamera: true, // iOS and Android
          showFlipCameraButton: true, // iOS and Android
          showTorchButton: true, // iOS and Android
          torchOn: true, // Android, launch with the torch switched on (if available)
          saveHistory: true, // Android, save scan history (default false)
          prompt: "Place a barcode inside the scan area", // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          orientation: "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations: true, // iOS
          disableSuccessBeep: false // iOS and Android
        }
      );
    }

    $scope.register = function () {
      db.transaction(function (tx) {
        if ($scope.password != $scope.confirmpassword) {
          $scope.registererror = "Passwords don't match";
          $scope.$apply();
        }
        else {
          db.transaction(function (tx) {
            tx.executeSql("INSERT INTO UserCredentials(username,password) VALUES(?, ?) ",
              [$scope.username, $scope.password],
              function () {
                $scope.username = "";
                $scope.password = "";
                $scope.confirmpassword = "";
                console.log("Inserted");
                $scope.registererror = "Registered successfully!.Login to continue";
                $scope.$apply();
              },
              function () {
                console.log("Insert failed");
                $scope.registererror = "Username already exists. Please enter a different Username";
                $scope.$apply();
              }
            );
          });
        }
      });
    }

    $scope.gotoIndexPage = function () {
      window.location = "index.html";
    }
    $scope.gotoLoginPage = function () {
      window.location = "login.html";
    }

    setInterval(function () {
      $scope.checkConnection();
    }, 1000)
 
 
    $scope.checkConnection = function () {
      network = navigator.network.connection.type;
      var states = {};
      states[Connection.UNKNOWN] = 'Unknown connection';
      states[Connection.ETHERNET] = 'Ethernet connection';
      states[Connection.WIFI] = 'WiFi connection';
      states[Connection.CELL_2G] = 'Cell 2G connection';
      states[Connection.CELL_3G] = 'Cell 3G connection';
      states[Connection.CELL_4G] = 'Cell 4G connection';
      states[Connection.NONE] = 'No network connection';
      if (states[network] == states[Connection.NONE]) {
        document.getElementById("youtube").innerHTML = "To view youtube video, you need to have an active Internet Connection";
        document.getElementById("maps").innerHTML = "To view the map, you need to have an active Internet Connection";
        document.getElementById("comments").innerHTML = "To post and read comments, you need to have an active Internet Connection";
        document.getElementById("reviews").innerHTML = "";
        document.getElementById("capstones").innerHTML = "To see our capstone books, you need to have an active Internet Connection";
      }
      //alert(states[network]);
    }

    $scope.sqlserverconnection = function () {
      cordova.plugins.SqlServer.init("40cff8ce-969f-4be2-a5ef-a8a101110ab5.sqlserver.sequelizer.com",
        "tlwqydbgnsopmiti", "Bvv3iDnYnqq7HSQ8Wj4KhrHtmpZtLQth2QjuYWmqobzQ2gMVcHXtxinjVcQ3M2nE", "db40cff8ce969f4be2a5efa8a101110ab5", function (event) {
          alert(JSON.stringify(event));
        }, function (error) {
          alert(JSON.stringify(error));
        });
    }

    $scope.gotoHomePage = function () {
      //$scope.checkConnection();
      window.location = "homepage.html";
    }

    $scope.playAudio = function () {
      var myMedia = null;
      var time = 3000;
      navigator.vibrate(time);
      //var src = "/android_asset/www/audio/piano.mp3";
      var src = "media/Diwali.mp3";

      if (myMedia === null) {
        myMedia = new Media(src, onSuccess, onError);
        function onSuccess() {
          console.log("playAudio Success");
        }

        function onError(error) {
          console.log("playAudio Error: " + error.code);
        }
      }
      myMedia.play();
    }

    //project and tasks start
    $scope.initializeFirebase = function () {
      var ref = new Firebase("https://a-7ffb3.firebaseio.com/IndianFestivals/f09a27b45e15b6e1a040e45338f2e161/");
      $scope.projects = $firebaseObject(ref);
    }


    $scope.sKey = "123";
    if ($scope.sKey != null) {
      $scope.initializeFirebase();
    }

    $scope.model = {};


    /*
    $scope.initializeStorage = function () {
      sMd5 = CryptoJS.MD5($scope.model.uname + $scope.model.password + "topSecret");
      localStorage.setItem("sMD5", sMd5);
      $scope.sKey = localStorage.getItem("sMD5");
      $scope.initializeFirebase();
    }

    $scope.addProject = function () {
      if ($scope.model.project) {
        $scope.projects[uuid.v4()] = { name: $scope.model.project };
        $scope.model.project = "";
        $scope.projects.$save();
        $scope.addProjectError = "";
      }
    }
    */

    $scope.addTask = function (project) {
      if (!project.hasOwnProperty("tasks")) {
        project.tasks = {};
      }
      if (project.task && project.task.length && project.task.start) {
        project.tasks[uuid.v4()] = { name: project.task.name, length: project.task.length, start: project.task.start };
        delete project.task;
        $scope.projects.$save();
        $scope.addProjectError = "";
      }
      $scope.notify();
    }
    //project and tasks end


  })
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })