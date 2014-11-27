angular.module('poliApp.controllers', ['poliApp.services'])
 
.controller('SignInCtrl', function ($rootScope, $scope, API, $window) {
    // if the user is already logged in, take him to his SauveApp app
    if ($rootScope.isSessionActive()) {
        $window.location.href = ('#/base/list');
    }
 
    $scope.user = {
        email: "",
        password: ""
    };
    
    $rootScope.showMenuButton = function () {
                return "false";
            };
 
    $scope.validateUser = function () {
        var email = this.user.email;
        var password = this.user.password;
        if(!email || !password) {
            $rootScope.notify("Please enter valid credentials");
            return false;
        }
        $rootScope.show('Please wait.. Authenticating');
        API.signin({
            email: email,
            password: password
        }).success(function (data) {
            $rootScope.setToken(email); // create a session kind of thing on the client side
            $rootScope.hide();
            $window.location.href = ('#/base/list');
        }).error(function (error) {
            $rootScope.hide();
            $rootScope.notify("Invalid Username or password");
        });
    }
 
})
 
.controller('SignUpCtrl', function ($rootScope, $scope, API, $window) {
    $scope.user = {
        email: "",
        password: "",
        name: ""
    };
 
    $scope.createUser = function () {
        var email = this.user.email;
        var password = this.user.password;
        var uName = this.user.name;
        if(!email || !password || !uName) {
            $rootScope.notify("Please enter valid data");
            return false;
        }
        $rootScope.show('Please wait.. Registering');
        API.signup({
            email: email,
            password: password,
            name: uName
        }).success(function (data) {
            $rootScope.setToken(email); // create a session kind of thing on the client side
            $rootScope.hide();
            $window.location.href = ('#/base/list');
        }).error(function (error) {
            $rootScope.hide();
            if(error.error && error.error.code == 11000)
            {
                $rootScope.notify("A user with this email already exists");
            }
            else
            {
                $rootScope.notify("Oops something went wrong, Please try again!");
            }
            
        });
    }
})
 
.controller('myListCtrl', function ($rootScope, $scope, API, $timeout, $ionicModal, $window) {
    $rootScope.$on('fetchAll', function(){
            API.getAll($rootScope.getToken()).success(function (data, status, headers, config) {
            $rootScope.show("Please wait... Processing");
            $scope.list = [];
            $scope.categoriesLoaded = [];
            for (var i = 0; i < data.length; i++) {
                $scope.categoryExist = false;
                
                numOfCategories = $scope.categoriesLoaded.length;
                
                if (numOfCategories == 0) {
                        $scope.categoriesLoaded.push(data[i].category);
                }
                
                for (var j = 0; j < numOfCategories; j++) {    
                    
                    if (data[i].category == $scope.categoriesLoaded[j])
                    {
                        $scope.categoryExist = true;
                    }
                }
                
                if ($scope.categoryExist == false)
                {
                    $scope.list.push(data[i]);
                    $scope.categoriesLoaded.push(data[i].category);
                }
            };
            if($scope.list.length == 0)
            {
                $scope.noData = true;
            }
            else
            {
                $scope.noData = false;
            }
 
            $ionicModal.fromTemplateUrl('templates/newItem.html', function (modal) {
                $scope.newTemplate = modal;
            });
 
            $scope.newTask = function () {
                $scope.newTemplate.show();
            };
                
            $rootScope.hide();
        }).error(function (data, status, headers, config) {
            $rootScope.hide();
            $rootScope.notify("Oops something went wrong!! Please try again later");
        });
    });
    
    $rootScope.showMenuButton = function () {
                return "true";
            };
    
    $rootScope.selectCategory = function (category) {
                $window.location.href="#/base/category"
                $rootScope.category = category
                $scope.$broadcast("$destroy");
            };
    
    $rootScope.$broadcast('fetchAll');
 
    $scope.markCompleted = function (id) {
        $rootScope.show("Please wait... Updating List");
        API.putItem(id, {
            isCompleted: true
        }, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(1);
            }).error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };
 
    $scope.deleteItem = function (id) {
        $rootScope.show("Please wait... Deleting from List");
        API.deleteItem(id, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(1);
            }).error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };
    
    $rootScope.setLawDescritpion = function (descriptionLink) {
        $rootScope.currentLink = descriptionLink;
        $scope.$broadcast("$destroy");
    };
    
    $scope.showDescription = function (descriptionLink) {
        $rootScope.show("Please wait... Accessing information outlet.");
        $scope.setLawDescritpion(descriptionLink);
        $window.location.href="#/base/description";
    };
    
    $scope.showDescription = function ContentController($scope, $ionicSideMenuDelegate) {
      $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
      };
    }
 
})


.controller('categoryCtrl', function ($rootScope, $scope, API, $timeout, $ionicModal, $window) {
    $rootScope.$on('fetchAll', function(){
            API.getAllTopics($rootScope.getToken(),$rootScope.category).success(function (data, status, headers, config) {
            $rootScope.show("Please wait... Processing");
            $scope.topicList = [];
            for (var i = 0; i < data.length; i++) {
//                Code example for when there is a need  to separate loading parameters
//                if (data[i].isCompleted == false) {
                    $scope.topicList.push(data[i]);
//                }
            };
            if($scope.list.length == 0)
            {
                $scope.noData = true;
            }
            else
            {
                $scope.noData = false;
            }
 
            $ionicModal.fromTemplateUrl('templates/newItem.html', function (modal) {
                $scope.newTemplate = modal;
            });
 
            $scope.newTask = function () {
                $scope.newTemplate.show();
            };
                
            $rootScope.hide();
        }).error(function (data, status, headers, config) {
            $rootScope.hide();
            $rootScope.notify("Oops something went wrong!! Please try again later");
        });
    });
 
    $rootScope.selectTopic = function (topic, topicContent) {
                
                $window.location.href="#/base/topic"
                $rootScope.topic = topic
                $rootScope.topicContent = topicContent
            };
    
    $rootScope.$broadcast('fetchAll');
 
    
    $rootScope.setLawDescritpion = function (descriptionLink) {
        $rootScope.currentLink = descriptionLink;
        $scope.$broadcast("$destroy");
    };
    
    $scope.showDescription = function (descriptionLink) {
        $rootScope.show("Please wait... Accessing information outlet.");
        $scope.setLawDescritpion(descriptionLink);
        $window.location.href="#/base/description";
    };
    
    $scope.showDescription = function ContentController($scope, $ionicSideMenuDelegate) {
      $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
      };
    }
 
})

 
.controller('completedCtrl', function ($rootScope,$scope, API, $window) {
    $rootScope.$on('fetchCompleted', function () {
        API.getAll($rootScope.getToken()).success(function (data, status, headers, config) {
            $scope.list = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].isCompleted == true) {
                    $scope.list.push(data[i]);
                }
            };
            if(data.length > 0 & $scope.list.length == 0)
            {
                $scope.incomplete = true;
            }
            else
            {
                $scope.incomplete= false;
            }

            if(data.length == 0)
            {
                $scope.noData = true;
            }
            else
            {
                $scope.noData = false;
            }
        }).error(function (data, status, headers, config) {
            $rootScope.notify("Oops something went wrong!! Please try again later");
        });

    });

    $rootScope.$broadcast('fetchCompleted');
    $scope.deleteItem = function (id) {
        $rootScope.show("Please wait... Deleting from List");
        API.deleteItem(id, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(2);
            }).error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };
})
 
.controller('newCtrl', function ($rootScope, $scope, API, $window) {
    $scope.data = {
        item: ""
    };

    $scope.close = function () {
        $scope.modal.hide();
    };

    $scope.createNew = function () {
        var item = this.data.item;
        if (!item) return;
        $scope.modal.hide();
        $rootScope.show();

        $rootScope.show("Please wait... Creating new");

        var form = {
            item: item,
            isCompleted: false,
            user: $rootScope.getToken(),
            created: Date.now(),
            updated: Date.now()
        }

        API.saveItem(form, form.user)
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(1);
            })
            .error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };
})