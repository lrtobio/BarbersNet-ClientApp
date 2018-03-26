angular.module('starter.controllers', [])
    .controller('AppCtrl', function ($scope, $window,$ionicHistory, $rootScope, App, $ionicLoading, $location, $ionicPopup, $cordovaLocalNotification, MobileUser,$filter) {

        $scope.loginData = {
            email: '',
            password: '',
            enviadopor: '',
            locale: navigator.language
        };
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };
        $scope.login = function () {
            $scope.modal.show();
        };
        $scope.doLogin = function () {
            localStorage.setItem('muser_barber', '');
            $scope.show = function () {
                $ionicLoading.show({
                    template: ' <ion-spinner></ion-spinner>'
                });
            };

            $scope.hide = function () {
                $ionicLoading.hide();
            };

            if ($scope.loginData != null &&
                    ($scope.loginData.email != null && $scope.loginData.email != '') &&
                    ($scope.loginData.password != null && $scope.loginData.password != '')) {
                $scope.loginData.enviadopor = 'client';
                $scope.show();
                App.login($scope.loginData).then(function successCallback(result) {
                    
                    $scope.hide();

                    if (result != null && result.data != null && result.data.response != null) {

                        if (result.data.response.success == true) {
                            localStorage.setItem('muser_barber', JSON.stringify(result.data.response.data));
                            var push = new Ionic.Push({
                                "debug": true,
                                "onNotification": function(notification) {
                                    console.log(notification);
                                    var payload = notification.payload;

                                    if( payload!=null ){

                                        if( payload.action && 
                                                payload.action!=null && payload.action!='' ){

                                            if( payload.action=='appointment_added' ){                             

                                                var appointment_id = '', fecha = '';

                                                if( payload.appointment_id && 
                                                    payload.appointment_id!=null && payload.appointment_id!='' ){
                                                    appointment_id = payload.appointment_id;
                                                }

                                                if( payload.fecha && 
                                                    payload.fecha!=null && payload.fecha!='' ){
                                                    fecha = payload.fecha;
                                                }
                                                
                                                //console.log('push recibido - AppCtrl');
                                                //console.log( payload.action + ' - ' + appointment_id + ' - ' + fecha );

                                                //$location.path('/app/appointments2/' + appointment_id + '/' + fecha);

                                                
                                                //$ionicHistory.nextViewOptions({
                                                //    disableAnimate: true,
                                                //    disableBack: true,
                                                //    historyRoot: true
                                                //});
                                                
                                               /*
                                               if( $ionicHistory.currentView().stateName &&
                                                       $ionicHistory.currentView().stateName!=null &&
                                                            $ionicHistory.currentView().stateName!='' ){
                                                   
                                                    //if( $ionicHistory.currentView().stateName=='app.appointments' )
                                                    //    $window.location.href = ('#/app/appointments2/' + appointment_id + '/' + fecha);
                                                    //else
                                                    if( $ionicHistory.currentView().stateName=='app.appointments2' )
                                                        $window.location.href = ('#/app/appointments3/' + appointment_id + '/' + fecha);
                                                    else  
                                                        $window.location.href = ('#/app/appointments2/' + appointment_id + '/' + fecha);
                                                        
                                                }else
                                                    $window.location.href = ('#/app/appointments2/' + appointment_id + '/' + fecha); */
                                                $window.location.href = ('#/app/appointment/' + appointment_id);
                                                $scope.scheduledNotification(appointment_id, fecha);
                                                //$location.path('/app/appointments2/' + appointment_id + '/' + fecha);
                                                //$window.location.reload(true);
                                            }else if( payload.action=='appointment_deleted' ){
                                    
                                                var appointment_id = '', fecha = '', service = '', client = '', motivo='';

                                                if( payload.appointment_id && 
                                                    payload.appointment_id!=null && payload.appointment_id!='' ){
                                                    appointment_id = payload.appointment_id;
                                                }

                                                if( payload.fecha && 
                                                    payload.fecha!=null && payload.fecha!='' ){
                                                    fecha = moment(new Date(payload.fecha)).format('MMMM D YYYY, h:mm a');
                                                }

                                                if( payload.service && 
                                                    payload.service!=null && payload.service!='' ){
                                                    service = payload.service;
                                                }

                                                if( payload.client && 
                                                    payload.client!=null && payload.client!='' ){
                                                    client = payload.client;
                                                }
                                                if( payload.motivo && 
                                                    payload.motivo!=null && payload.motivo!='' ){

                                                    motivo = payload.motivo;
                                                }                        

                                                $ionicPopup.alert({
                                                    //title: '<b>'+ $filter('translate')('cancel_appo')+'</b>',
                                                    template: ('<center><b>'+ $filter('translate')('cancel_appo')+'</b></center>'+'<br/>\n' + service + '<br/> ' + fecha + '<br/> ' + client + '<center>' + motivo + '</center>')
                                                }).then(function (res) {

                                                if (result.data.response.success == true) {

                                                    $cordovaLocalNotification.cancel(appointment_id).then(function (res) {
                                                        if (res)
                                                            console.log("Notificación cancelada");
                                                        else
                                                            console.log("No se pudo cancelar");
                                                    });
                                                    $ionicHistory.goBack();
                                                    $window.location.reload(true);
                                                }
                                            });
                                            }
                                        }
                                    }
                                }
                                /*"pluginConfig": {
                                  "android": {
                                    "icon": "icon",
                                    "iconColor": "#F47D30"
                                  }
                                }*/
                            });
                            push.register(function(token) {                                
                                console.log("Device token ctrl:", token);
                                if( token.token && token.token!=null && token.token!='' ){
                                    push.saveToken(token);  // persist the token in the Ionic Platform
                                    var updateUserToken = false;

                                    //var barber = JSON.parse(localStorage.getItem('Barber'));

                                    //f( barber!=null && barber!='' && barber!='null' ){
                                        var muser = JSON.parse(localStorage.getItem('muser_barber'));
                                        console.log("MobileUser token ctrl:", muser.MobileUser.tokenpush);

                                        if( muser.MobileUser && muser.MobileUser.tokenpush && muser.MobileUser.tokenpush!=null && 
                                                muser.MobileUser.tokenpush!='' && muser.MobileUser.tokenpush!='undefined' ){

                                            if( muser.MobileUser.tokenpush!=token.token )
                                                updateUserToken = true;

                                        }else
                                            updateUserToken = true;
                                    //}
                                    if( updateUserToken==true ){
                                        show = function () {
                                            $ionicLoading.show({
                                                template: ' <ion-spinner></ion-spinner>'
                                            });
                                        };

                                        hide = function () {
                                            $ionicLoading.hide();
                                        };

                                        var muserData = {
                                            mobile_user_id: muser.MobileUser.id,
                                            tokenpush: token.token,
                                            email: '',
                                            name: '',
                                            foto: '',
                                            phone: '',
                                            password: '',
                                            birthdate: '',
                                            observations: '',
                                            extensionfoto: '',
                                            gender:'',
                                            creadorpor:'',
                                            codigobarbero:'',
                                            enviadopor: 'client',
                                            locale:''
                                        };

                                        show();
                                        console.log('controller');
                                        console.log(muserData);
                                        //console.log(barberData);
                                        MobileUser.editMobileUser(muserData).then(function successCallback(result) {

                                            console.log(result);
                                            hide();

                                            if (result!= null && result.data!= null && result.data.response != null) {
                                                //$scope.services = JSON.parse( JSON.stringify(result.data.response.data) );

                                                if (result.data.response.success == true)
                                                    localStorage.setItem('muser_barber', JSON.stringify(result.data.response.data));

                                            }

                                        }, function errorCallback(response) {
                                            // called asynchronously if an error occurs
                                            // or server returns response with an error status.

                                            hide();
                                        });
                                    }
                                }
                            });
                            muser = JSON.parse(localStorage.getItem('muser_barber'));
                            $rootScope.muserEmail = muser.MobileUser.email;
                            $rootScope.muserName = muser.MobileUser.nombre;
                            $rootScope.muserCreated = muser.MobileUser.created;
                            if (muser.MobileUser.foto != null && muser.MobileUser.foto != '') {
                                $rootScope.muserFoto = muser.MobileUser.foto;
                            }
                            else {
                                $rootScope.muserFoto = 'img/img_nouser.png';
                            }
                            
                            $ionicHistory.nextViewOptions({
                                disableAnimate: true,
                                disableBack: true,
                                historyRoot: true
                            });

                            $location.path('/app/appointments');

                        } else {
                            
                            var msg = 'Login failed, please, check your email and password and try again';
                            if (result.data.response.message != null && result.data.response.message != '')
                                msg = result.data.response.message;
                            $ionicPopup.alert({
                                //title: '<h3 class="dark">Info</h3>',
                                template: msg
                            });
                        }

                    } else {
                        $ionicPopup.alert({
                            ////title: '<h2 class="dark">Warning<h2>',
                            template: $filter('translate')('error_login')
                        });
                    }
                }, function errorCallback() {
                    
                    $scope.hide();
                    $ionicPopup.alert({
                        ////title: '<h2 class="dark">Warning<h2>',
                        template: $filter('translate')('error_login')
                    });
                });

            } else {

                $ionicPopup.alert({
                    //title: '<h2 class="dark">Info<h2>r',
                    template: $filter('translate')('complete_login')
                });
            }
        };
        $scope.signOut = function () {
            $ionicPopup.confirm({
                //title: '<h2 class="dark">Exit<h2>',
                template: $filter('translate')('sign_out_msg')
            }).then(function (res) {
                
                if (res) {
                    localStorage.setItem('muser_barber', '');
                    localStorage.setItem('appo_barber', '');
                    
                    $rootScope.muserEmail = '';
                    $rootScope.muserName = '';
                    $rootScope.muserCreated = '';
                    $rootScope.muserFoto = '';
                    
                    /*
                    if (navigator.app) {
                        navigator.app.exitApp();
                    } else if (navigator.device) {
                        navigator.device.exitApp();
                    } else {
                        $ionicHistory.nextViewOptions({
                            disableAnimate: true,
                            disableBack: true,
                            historyRoot: true
                        });
                        $location.path('/app/login');
                    }
                    */
                    $ionicHistory.nextViewOptions({
                        disableAnimate: true,
                        disableBack: true,
                        historyRoot: true
                    });
                    $window.location.reload(true);
                    $location.path('/app/login');
                    //$location.path('/app/welcome');
                }
            });
        };

        var muser = localStorage.getItem('muser_barber');
        if (muser != null && muser != '') {
            muser = JSON.parse(localStorage.getItem('muser_barber'));
            $rootScope.muserEmail = muser.MobileUser.email;
            $rootScope.muserName = muser.MobileUser.nombre;
            $rootScope.muserCreated = muser.MobileUser.created;
            if (muser.MobileUser.foto != null && muser.MobileUser.foto != '') {
                $rootScope.muserFoto = muser.MobileUser.foto;
            }
            else {
                $rootScope.muserFoto = 'img/img_nouser.png';
            }
        }

        $scope.forgotPassword = function () {

            show = function () {
                $ionicLoading.show({
                    template: ' <ion-spinner></ion-spinner>'
                });
            };

            hide = function () {
                $ionicLoading.hide();
            };

            //alert('tejo');
            //$scope.data = { email2: '' };
            var myPopup = $ionicPopup.show({
                template: '<input type="email" id="emailForgot" ng-model="dataForgot.email2">',
                title: '<p class="fontBlack">'+ $filter('translate')('enter_email') +'</p>',
                //subTitle: 'Please use normal things',
                scope: $scope,
                buttons: [
                    {text: $filter('translate')('cancel')},
                    {
                        text: '<b>'+ $filter('translate')('send') +'</b>',
                        type: 'button-positive',
                        onTap: function (e) {

                            var emailForgot = document.getElementById('emailForgot').value
                            if (emailForgot && emailForgot != null && emailForgot != '') {

                                if (emailForgot.indexOf('@') > -1) {

                                    show();

                                    var barberData = {
                                        //barber_id: barber.Barber.id
                                        email: emailForgot,
                                        enviadopor: 'client'
                                    };

                                    MobileUser.requestRememberPassword(barberData).then(function successCallback(result) {

                                        hide();

                                        var msg = 'Please check your email inbox';

                                        if (result.data && result.data.response && result.data.response.success) {
                                            
                                            if (result.data.response.success == true) {
                                                
                                                if (result.data.response.message != null && result.data.response.message != '')
                                                    msg = result.data.response.message;
                                                else
                                                    msg = "Email sent. Please check your inbox";
                                                
                                            }else{
                                                
                                                if (result.data.response.message != null && result.data.response.message != '')
                                                    msg = result.data.response.message;
                                                else
                                                    msg = "We couldn't send an email with your password, please try again";
                                                
                                            }

                                        } else
                                            msg = "We couldn't send an email with your password, please try again";

                                        $ionicPopup.alert({
                                            //title: '<p class="fontBlack">Info</p>',
                                            template: msg
                                        });

                                    }, function errorCallback(response) {
                                        // called asynchronously if an error occurs
                                        // or server returns response with an error status.

                                        hide();
                                        $ionicPopup.alert({
                                            //title: 'Info',
                                            template: $filter('translate')('verify_connection')
                                        });
                                    });

                                } else {
                                    $ionicPopup.alert({
                                        //title: 'Info',
                                        template: $filter('translate')('type_email')
                                    });
                                    e.preventDefault();
                                }

                            } else {

                                $ionicPopup.alert({
                                    ////title: 'Info',
                                    template: $filter('translate')('type_email')
                                });
                                e.preventDefault();
                            }
                        }
                    }
                ]
            });
        };
        
        $scope.scheduledNotification = function (id, alarm/*, hour*/) {
            //if( !hour || hour==null || hour=='' || hour==='' || hour=="" || hour==="" )
              //  hour = "08:00";
            var alarmTime = new Date(moment(alarm));
            $cordovaLocalNotification.schedule({
                id: id,
                at: alarmTime,
                title: 'BarbersNet',
                text: $filter('translate')('reminder_appo'),
                icon: 'res://icon',
                smallIcon: 'res://ic_bs_pole',
                data: {
                    fecha: 'myFecha'
                }
            }).then(function () {
                console.log('Notification 1 triggered');
            });
        };

    })

    .controller('AppointmentsCtrl', function ($scope, $location, Appointments, $ionicLoading,
                    $ionicPopup, $cordovaLocalNotification, $ionicHistory, $window, $filter) {

        //$ionicNavBarDelegate.showBackButton(false);
        /*
        $scope.toggleLeftSideMenu = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };
        */
       
        $scope.show = function () {
            $ionicLoading.show({
                template: ' <ion-spinner></ion-spinner>'
            });
        };

        $scope.hide = function () {
            $ionicLoading.hide();
        };

        var muser = JSON.parse(localStorage.getItem('muser_barber'));
        var params = {'mobile_user_id': muser.MobileUser.id};
        $scope.appointments = [];
        $scope.show();
        Appointments.getAppointmentList(params).then(function successCallback(result) {
            $scope.hide();
            if (result != null && result.data != null && result.data.response != null && result.data.response.data != null) {
                $scope.appointments = JSON.parse(JSON.stringify(result.data.response.data));
                localStorage.setItem('appo_barber', JSON.stringify(result.data.response.data));
            } else {
                $ionicPopup.alert({
                    //title: '<h2 class="dark">Info</h2>',
                    template: $filter('translate')('no_appo_list')
                });
            }
        }, function errorCallback() {
            $scope.hide();
            $scope.appointments = JSON.parse(localStorage.getItem('appo_barber'));
            $ionicPopup.alert({
                //title: '<h2 class="dark">Info<h2>',
                template: $filter('translate')('no_server_connection')
            });
        });

        $scope.goAddAppointment = function () {
            $location.path('/app/appointment-add/-1');
        };

        $scope.removeAppointment = function (appointment_id) {

            $ionicPopup.show({

                template: '<input type="text" id="obsCancel" >',
                title: '<h3 class="dark">'+$filter('translate')('type_reasons')+'</h3>',
                scope: $scope,
                buttons: [
                  { text: $filter('translate')('cancel') },
                  {
                    text: '<b>'+ $filter('translate')('send') +'</b>',
                    type: 'button-positive',
                    onTap: function(e) {

                        var obsCancel = document.getElementById('obsCancel').value
                        if( obsCancel && obsCancel!=null && obsCancel!='' ){

                            $ionicPopup.confirm({
                                ////title: '<h2 class="dark">Confirm<h2>',
                                template: $filter('translate')('confirm_delete'),
                                //default: 'cancel'
                            }).then(function (res) {

                                if (res) {
                                    var barber = JSON.parse(localStorage.getItem('muser_barber'));
                                    var params = {
                                        //'barber_id': barber.MobileUser.barber_id,
                                        'mobile_user_id': barber.MobileUser.id,
                                        'appointment_id': appointment_id,
                                        'enviadopor' : 'client',
                                        'observaciones': obsCancel
                                    };

                                    $scope.show();

                                    Appointments.deleteAppointment(params).then(function successCallback(result) {

                                        if (result != null && result.data != null &&
                                                result.data.response != null) {
                                            console.log(result);
                                            $scope.hide();
                                            var msg = $filter('translate')('error_delete');

                                            if (result.data.response.message != null && result.data.response.message != '')
                                                msg = result.data.response.message;

                                            $ionicPopup.alert({
                                                //title: '<h2 class="dark">Info</h2>',
                                                template: msg
                                            }).then(function (res) {

                                                if (result.data.response.success == true) {

                                                    $cordovaLocalNotification.cancel(appointment_id).then(function (res) {
                                                        if (res)
                                                            console.log("Notificación cancelada");
                                                        else
                                                            console.log("No se pudo cancelar");
                                                    });
                                                    $ionicHistory.goBack();
                                                    $window.location.reload(true);
                                                }
                                            });
                                        } else {

                                            var msg = $filter('translate')('error_delete');
                                            if (result.data.response.message != null && result.data.response.message != '')
                                                msg = result.data.response.message;

                                            $scope.hide();
                                            $ionicPopup.alert({
                                                //title: '<h2 class="dark">Info</h2>',
                                                template: msg
                                            });
                                        }
                                    }, function errorCallback() {
                                        $scope.hide();
                                        $ionicPopup.alert({
                                            //title: '<h2 class="dark">Info<h2>',
                                            template: $filter('translate')('no_server_connection')
                                        });
                                    });

                                } else {
                                    //console.log('You are not sure');
                                }
                            });

                        }else{

                            $ionicPopup.alert({
                                //title: 'Info',
                                template: $filter('translate')('type_reasons')
                            });
                            e.preventDefault();
                        }
                    }
                  }
                ]
            });
        };
        
        $scope.doRefresh = function(){
            $window.location.reload(true);
        };

    })

    .controller('AppointmentDetailCtrl', function ($scope, $stateParams, Appointments, $ionicLoading, $location, $ionicPopup, $ionicHistory, $window, $cordovaLocalNotification, $filter) {

        //$ionicNavBarDelegate.showBackButton(true);
        $scope.myGoBack = function() {
            //$ionicHistory.goBack();
            $location.path('/app/appointments');
        };
        /*
        $scope.$on('$ionicView.loaded', function(event) {
            console.log( '$ionicView.loaded' );
            console.log( event );
        });
        */

        $scope.show = function () {
            $ionicLoading.show({
                template: ' <ion-spinner></ion-spinner>'
            });
        };

        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.modificarcita = false;//true is temporal
        $scope.label_tipovalor = '';

        if( $stateParams.esrecordatorio && $stateParams.esrecordatorio!=null && 
                $stateParams.esrecordatorio!='' )
            //$scope.recodatorio = $stateParams.esrecordatorio;
            $scope.modificarcita = true;
        else{

            //var barber = JSON.parse(localStorage.getItem('muser_barber'));

            //if( $stateParams.appointment_id==barber.MobileUser.id ||
                    //$stateParams.appointment_id===barber.MobileUser.id )

        }
        var muser = JSON.parse(localStorage.getItem('muser_barber'));
        var params = {'mobile_user_id': muser.MobileUser.id,'appointment_id': $stateParams.appointment_id};
        $scope.appointment = [];
        $scope.show();
        
        //console.log( params );
        Appointments.getAppointmentDetail(params).then(function successCallback(result) {
            
            //console.log( result );

            if (result != null && result.data != null && result.data.response != null && result.data.response.data != null) {

                $scope.appointment = JSON.parse(JSON.stringify(result.data.response.data));
                $scope.hide();

                var today = new Date();
                var fechaAppo = new Date( $scope.appointment.Appointment.fecha );

                //console.log( today );
                //console.log( fechaAppo );

                if( fechaAppo.getTime()>=today.getTime() ){
                    //console.log( 'es mayor o igual' );
                    $scope.modificarcita = true;
                }//else
                    //console.log( 'es menor ' );
                    
                //console.log( $scope.appointment.Service.linkdepago );

                //$scope.appointment.Service.link = '';
                if( $scope.appointment.Service.linkdepago.startsWith('http')==true ){
                    //$scope.appointment.Service.link = 'url';

                    //document.getElementById('link').innerHTML = ('<a  class="button button-icon icon ion-cash fontWhite" href="' + $scope.appointment.Service.linkdepago + '" target="_blank" >&nbsp;&nbsp;Click here to pay</a>');
                    document.getElementById('link').innerHTML = ('<a  class="button button-icon icon ion-cash fontWhite" href="' + $scope.appointment.Service.linkdepago + '" >&nbsp;&nbsp;Click here to pay</a>');

                }else{
                    //$scope.appointment.Service.link = 'form';
                    document.getElementById('link').innerHTML = ($scope.appointment.Service.linkdepago);
                }
                
                switch ($scope.appointment.Appointment.tipovaloradicional){
                        case 'D':
                            $scope.label_tipovalor = $filter('translate')('discount');
                        break;
                        case 'P':
                            $scope.label_tipovalor = $filter('translate')('tip');
                        break;
                        case 'A':
                            $scope.label_tipovalor = $filter('translate')('pay_add');
                        break;
                    } 

            } else {
                $scope.hide();
                $ionicPopup.alert({
                    //title: '<h2 class="dark">Info</h2>',
                    template: $filter('translate')('no_appo')
                });
            }
            
        }, function errorCallback() {
            
            $scope.hide();
            $ionicPopup.alert({
                //title: '<h2 class="dark">Info<h2>',
                template: $filter('translate')('no_server_connection')
            });
        });

        $scope.removeAppointment = function (appointment_id) {

            $ionicPopup.show({

                template: '<input type="text" id="obsCancel" >',
                title: '<h3 class="dark">'+$filter('translate')('type_reasons')+'</h3>',
                scope: $scope,
                buttons: [
                  { text: $filter('translate')('cancel') },
                  {
                    text: '<b>'+ $filter('translate')('send') +'</b>',
                    type: 'button-positive',
                    onTap: function(e) {

                        var obsCancel = document.getElementById('obsCancel').value
                        if( obsCancel && obsCancel!=null && obsCancel!='' ){

                            $ionicPopup.confirm({
                                //title: '<h2 class="dark">Confirm<h2>',
                                template: $filter('translate')('confirm_delete'),
                                //default: 'cancel'
                            }).then(function (res) {

                                if (res) {
                                    var barber = JSON.parse(localStorage.getItem('muser_barber'));
                                    var params = {
                                        //'barber_id': barber.MobileUser.barber_id,
                                        'mobile_user_id': barber.MobileUser.id,
                                        'appointment_id': appointment_id,
                                        'enviadopor' : 'client',
                                        'observaciones': obsCancel
                                    };

                                    $scope.show();
                                    console.log(params);
                                    Appointments.deleteAppointment(params).then(function successCallback(result) {

                                        if (result != null && result.data != null &&
                                                result.data.response != null) {
                                            console.log(result);
                                            $scope.hide();
                                            var msg = $filter('translate')('error_delete');

                                            if (result.data.response.message != null && result.data.response.message != '')
                                                msg = result.data.response.message;

                                            $ionicPopup.alert({
                                                //title: '<h2 class="dark">Info</h2>',
                                                template: msg
                                            }).then(function (res) {

                                                if (result.data.response.success == true) {

                                                    $cordovaLocalNotification.cancel(appointment_id).then(function (res) {
                                                        if (res)
                                                            console.log("Notificación cancelada");
                                                        else
                                                            console.log("No se pudo cancelar");
                                                    });
                                                    $ionicHistory.goBack();
                                                    $window.location.reload(true);
                                                }
                                            });
                                        } else {

                                            var msg = $filter('translate')('error_delete');
                                            if (result.data.response.message != null && result.data.response.message != '')
                                                msg = result.data.response.message;

                                            $scope.hide();
                                            $ionicPopup.alert({
                                                //title: '<h2 class="dark">Info</h2>',
                                                template: msg
                                            });
                                        }
                                    }, function errorCallback() {
                                        $scope.hide();
                                        $ionicPopup.alert({
                                            //title: '<h2 class="dark">Info<h2>',
                                            template: $filter('translate')('no_server_connection')
                                        });
                                    });

                                } else {
                                    //console.log('You are not sure');
                                }
                            });

                        }else{

                            $ionicPopup.alert({
                                //title: 'Info',
                                template: $filter('translate')('type_reasons')
                            });
                            e.preventDefault();
                        }
                    }
                  }
                ]
            });
        };

        /*
        $scope.confirmAppointment = function (appointment_id) {

            $ionicPopup.confirm({
                //title: '<h2 class="dark">Confirm<h2>',
                template: 'Are you sure you want to confirm this appointment ?',
                //default: 'cancel'
            }).then(function (res) {

                if (res) {
                    var barber = JSON.parse(localStorage.getItem('muser_barber'));
                    var params = {'barber_id': barber.MobileUser.barber_id, 'appointment_id': appointment_id};

                    $scope.show();

                    Appointments.confirmAppointment(params).then(function successCallback(result) {

                        if (result != null && result.data != null &&
                                result.data.response != null) {
                            $scope.hide();
                            var msg = "Appointment couldn't be confirmed";

                            if (result.data.response.message != null && result.data.response.message != '')
                                msg = result.data.response.message;

                            $ionicPopup.alert({
                                //title: '<h2 class="dark">Info</h2>',
                                template: msg
                            }).then(function (res) {
                                if (result.data.response.success == true) {
                                    $cordovaLocalNotification.cancel(appointment_id).then(function (res) {
                                        if (res)
                                            console.log("Notificación cancelada");
                                        else
                                            console.log("No se pudo cancelar");
                                    });
                                    $ionicHistory.goBack();
                                    $window.location.reload(true);
                                }
                            });
                        } else {
                            var msg = "Appointment couldn't be confirmed";
                            if (result.data.response.message != null && result.data.response.message != '')
                                msg = result.data.response.message;

                            $scope.hide();
                            $ionicPopup.alert({
                                //title: '<h2 class="dark">Info</h2>',
                                template: msg
                            });
                        }
                    }, function errorCallback() {
                        $scope.hide();
                        $ionicPopup.alert({
                            //title: '<h2 class="dark">Info<h2>',
                            template: $filter('translate')('no_server_connection')
                        });
                    });

                } else {
                    //console.log('You are not sure');
                }
            });
        };
        */
        $scope.cancelAppointment = function (appointment_id) {

            show = function () {
                $ionicLoading.show({
                    template: ' <ion-spinner></ion-spinner>'
                });
            };

            hide = function () {
                $ionicLoading.hide();
            };

            $ionicPopup.show({

                template: '<input type="text" id="obsCancel" >',
                title: '<h2 class="dark">'+$filter('translate')('type_reasons')+'</h2>',
                scope: $scope,
                buttons: [
                  { text: $filter('translate')('cancel') },
                  {
                    text: '<b>'+ $filter('translate')('send') +'</b>',
                    type: 'button-positive',
                    onTap: function(e) {

                        var obsCancel = document.getElementById('obsCancel').value
                        if( obsCancel && obsCancel!=null && obsCancel!='' ){

                            $ionicPopup.confirm({
                                //title: '<h2 class="dark">Confirm<h2>',
                                template: $filter('translate')('confirm_delete'),
                                //default: 'cancel'
                            }).then(function (res) {

                                if (res) {

                                    show();

                                    var barber = JSON.parse(localStorage.getItem('muser_barber'));
                                    var params = {
                                        //'barber_id': barber.MobileUser.barber_id, 
                                        'mobile_user_id': barber.MobileUser.id, 
                                        'appointment_id': appointment_id,
                                        'enviadopor' : 'client',
                                        'observaciones': obsCancel
                                    };

                                    /*
                                    Appointments.requestRememberPassword(params).then(function successCallback(result) {

                                        hide();

                                        var msg = 'Please check you email inbox';

                                        if( result.data && result.data.response ){

                                            if( result.data.response.message!=null && result.data.response.message!='' )
                                                msg = result.data.response.message;
                                            else
                                                msg = "We could send an email with your password, please try again";

                                        }else
                                            msg = "We could send an email with your password, please try again";

                                        $ionicPopup.alert({
                                            //title: 'Info',
                                            template: msg
                                        });

                                    }, function errorCallback(response) {
                                        // called asynchronously if an error occurs
                                        // or server returns response with an error status.

                                        hide();
                                        $ionicPopup.alert({
                                            //title: 'Info',
                                            template: 'Please verify your internet connection and try again'
                                        });
                                    });
                                    */

                                    show();

                                    Appointments.cancelAppointment(params).then(function successCallback(result) {

                                        if (result != null && result.data != null &&
                                                result.data.response != null) {

                                            hide();
                                            var msg = $filter('translate')('error_delete');

                                            if (result.data.response.message != null && result.data.response.message != '')
                                                msg = result.data.response.message;

                                            $ionicPopup.alert({
                                                //title: '<h2 class="dark">Info</h2>',
                                                template: msg
                                            }).then(function (res) {

                                                if (result.data.response.success == true) {
                                                    $cordovaLocalNotification.cancel(appointment_id).then(function (res) {
                                                        if (res)
                                                            console.log("Notificación cancelada");
                                                        else
                                                            console.log("No se pudo cancelar");
                                                    });
                                                    $ionicHistory.goBack();
                                                    $window.location.reload(true);
                                                }
                                            });
                                        } else {

                                            var msg = $filter('translate')('error_delete');
                                            if (result.data.response.message != null && result.data.response.message != '')
                                                msg = result.data.response.message;

                                            hide();
                                            $ionicPopup.alert({
                                                //title: '<h2 class="dark">Info</h2>',
                                                template: msg
                                            });
                                        }
                                    }, function errorCallback() {

                                        hide();
                                        $ionicPopup.alert({
                                            //title: '<h2 class="dark">Info<h2>',
                                            template: $filter('translate')('no_server_connection')
                                        });
                                    });

                                } else {
                                    //console.log('You are not sure');
                                }
                            });

                        }else{

                            $ionicPopup.alert({
                                //title: 'Info',
                                template: $filter('translate')('type_reasons')
                            });
                            e.preventDefault();
                        }
                    }
                  }
                ]
            });
        };

    })

    .controller('AppointmentAddCtrl', function ($scope, Services, MobileUser, Appointments, 
        $ionicLoading, $location, $filter, $ionicPopup, $window, $stateParams,
        $cordovaLocalNotification, Barbers, $state) {

        var barber_id = '';

        if( $stateParams.barber_id && $stateParams.barber_id!=null && $stateParams.barber_id!='' )
            barber_id = $stateParams.barber_id;
            var today = new Date();
            today = new Date( today.getFullYear(), today.getMonth(), today.getDate() );
        $scope.dataAddAppo = {
            date: $filter("date")(today, 'yyyy-MM-dd'),
            selectTime: [],
            selectServices: [],
            params: [],
            barber_name: '',
            barber_fotourl: '',
            observations: '',
            barber_currency: ''
        };
        
        $scope.onezoneDatepicker = {
            mondayFirst: false,
            disablePastDays: true,
            disableSwipe: false,
            disableWeekend: false,
            showDatepicker: false,
            showTodayButton: true,
            calendarMode: false,
            hideCancelButton: false,
            hideSetButton: false,
            callback: function (value) {
                var fecha = $filter('date')(value, "yyyy-MM-dd");
                $scope.dataAddAppo.date = fecha;
                $scope.searchTime();
                //$scope.openSelect( "#selectTime" );
            }
        };
        $scope.dataAddAppo.date = $filter('date')($scope.dataAddAppo.date, "yyyy-MM-dd");

        
        $scope.show = function () {
            $ionicLoading.show({
                template: ' <ion-spinner></ion-spinner>'
            });
        };

        $scope.hide = function () {
            $ionicLoading.hide();
        };

        //$scope.show();
        var muser = JSON.parse(localStorage.getItem('muser_barber'));
        
        /*
        var param = {'muser_id': muser.MobileUser.id};

        MobileUser.getMobileUser(param).then(function successCallback(result) {

            $scope.hide();

            if (result != null && result.data != null && result.data.response != null && result.data.response.data != null) {

                var muserTemp = JSON.parse(JSON.stringify(result.data.response.data));
                var barber_name = '', currency = '', barber_fotourl = '';

                if( barber_id=='-1' || barber_id==muserTemp.MobileUser.barber_id) {

                    $scope.dataAddAppo.params = {'barber_id': muserTemp.MobileUser.barber_id, 'mobile_user_id': muserTemp.MobileUser.id};
                    barber_name = muserTemp.Barber.name;
                    currency = muserTemp.Barber.currency;

                    barber_fotourl = muserTemp.Barber.foto_url;

                } else {

                    $scope.dataAddAppo.params = {'barber_id': $stateParams.barber_id, 'mobile_user_id': muserTemp.MobileUser.id};
                    barber_name = $rootScope.barber_selected_name;
                    barber_fotourl = $rootScope.muserFoto;

                    currency = $rootScope.barber_currency;
                    $ionicPopup.confirm({
                        //title: '<h2 class="dark">Warning<h2>',
                        template: barber_name + ' Is not your default barber. <br/> Do you want to change him?',
                        //default: 'cancel'
                    }).then(function (res) {
                        if (res) {
                            $scope.setNewBarberId($scope.dataAddAppo.params);
                        }
                    });

                }
                $scope.dataAddAppo.barber_name = barber_name;
                $scope.dataAddAppo.barber_fotourl = barber_fotourl;

                $scope.dataAddAppo.barber_currency = currency;
                $scope.getService($scope.dataAddAppo.params);
            }
            else {
                alert(result.data.response.message);
            }
        }, function errorCallback() {
            $scope.hide();
            $ionicPopup.alert({
                //title: '<h2 class="dark">Info<h2>',
                template: $filter('translate')('no_server_connection')
            });
        });
        */
       
       
        {
            var muser = JSON.parse(localStorage.getItem('muser_barber'));
            //console.log(muser);
                        
            if( (barber_id==0 || barber_id=='0') || barber_id==muser.MobileUser.barber_id) {
                
                /*
                $scope.dataAddAppo.barber_name = muser.Barber.nombre;
                $scope.dataAddAppo.barber_currency = muser.Barber.currency;
                $scope.dataAddAppo.barber_fotourl = muser.Barber.foto_url;
                
                $scope.dataAddAppo.params = {'barber_id': muser.Barber.id, 'mobile_user_id': muser.MobileUser.id};
                $scope.getService($scope.dataAddAppo.params);
                */
                
                var params = {'mobile_user_id': muser.MobileUser.id, 'barber_id': muser.MobileUser.barber_id};
                
                if( muser.MobileUser.barber_id!=null & muser.MobileUser.barber_id!='' ){
                    
                    $scope.show();
                
                    Barbers.getBarber(params).then(function successCallback(result) {

                        $scope.hide();

                        if (result!=null && result.data!=null && result.data.response!=null &&
                                result.data.response.data!=null) {

                            var barberTemp = JSON.parse(JSON.stringify(result.data.response.data));

                            //console.log( barberTemp );

                            $scope.dataAddAppo.barber_name = barberTemp.Barber.nombre;
                            $scope.dataAddAppo.barber_currency = barberTemp.Barber.currency;
                            $scope.dataAddAppo.barber_fotourl = barberTemp.Barber.foto_url;

                            $scope.dataAddAppo.params = {'barber_id': barberTemp.Barber.id, 'mobile_user_id': muser.MobileUser.id};
                            //console.log( $scope.dataAddAppo.params );
                            $scope.getService($scope.dataAddAppo.params);
                            
                            if(barberTemp.Barber.activo == 'false'){
                                $ionicPopup.alert({
                                    //title: 'Info',
                                    template: barberTemp.Barber.mensaje_inactivo,
                                });
                            }
                                
                        }

                    }, function errorCallback() {

                        $scope.hide();
                    });
                    
                }else{
                    
                    $ionicPopup.confirm({
                        title: "<p class='fontBlack'>"+$filter('translate')('no_choosen_barber')+"</p>",
                        scope: $scope,
                        buttons: [{
                            text: $filter('translate')('yes'),
                            type: 'button-positive',
                            onTap: function (e) {

                                $state.go('app.search');
                                $window.location.reload(true);
                            }
                        }, {
                            text: 'No',
                            type: 'button-default',
                            onTap: function (e) {

                                $state.go('app.appointments');
                                $window.location.reload(true);
                            }
                        }
                        ]
                    });
                    
                    /*
                    $ionicPopup.confirm({
                        //title: '<h2 class="dark">Info<h2>',
                        template: "You don't have any default barber. Do you want to search one ?"
                        //default: 'No'
                    }).then(function (res) {
                        
                        if (res) {
                            
                            $state.go('app.search');
                            $window.location.reload(true);
                        }
                    });
                    */
                    
                }

            } else {
                
                if( barber_id!=null && barber_id!='' ){
                    
                    $scope.show();
                    
                    var params = {'mobile_user_id': muser.MobileUser.id, 'barber_id': barber_id};
                    Barbers.getBarber(params).then(function successCallback(result) {

                        $scope.hide();

                        if (result!=null && result.data!=null && result.data.response!=null &&
                                result.data.response.data!=null) {

                            var barberTemp = JSON.parse(JSON.stringify(result.data.response.data));

                            //console.log( barberTemp );

                            $scope.dataAddAppo.barber_name = barberTemp.Barber.nombre;
                            $scope.dataAddAppo.barber_currency = barberTemp.Barber.currency;
                            $scope.dataAddAppo.barber_fotourl = barberTemp.Barber.foto_url;

                            $ionicPopup.confirm({
                                //title: '<h2 class="dark">Warning<h2>',
                                template: $scope.dataAddAppo.barber_name + $filter('translate')('change_barber'),
                                //default: 'No'
                            }).then(function (res) {
                                if (res) {
                                    $scope.setNewBarberId($scope.dataAddAppo.params);
                                }
                            });

                            $scope.dataAddAppo.params = {'barber_id': barberTemp.Barber.id, 'mobile_user_id': muser.MobileUser.id};
                            //console.log( $scope.dataAddAppo.params );
                            $scope.getService($scope.dataAddAppo.params);
                        }

                    }, function errorCallback() {

                        $scope.hide();
                    }); 
                    
                }
            }
            
            /*
            $scope.dataAddAppo.barber_name = barber_name;
            $scope.dataAddAppo.barber_fotourl = barber_fotourl;

            $scope.dataAddAppo.barber_currency = currency;
            $scope.getService($scope.dataAddAppo.params);
            */
        }

        $scope.setNewBarberId = function (params) {
            
            MobileUser.updateBarberId(params).then(function (result) {
                
                if (result != null && result.data != null && result.data.response != null && result.data.response.data != null) {
                    
                    localStorage.setItem('muser_barber', JSON.stringify(result.data.response.data));
                    
                    //alert('Barber was Changed');
                    
                    $ionicPopup.alert({
                        //title: '<h2 class="dark">Info<h2>',
                        template: $filter('translate')('msg_changed_barber')
                    });
                }
                else {
                    //alert('Could not change anything! sorry');
                    
                    $ionicPopup.alert({
                        //title: '<h2 class="dark">Warning<h2>',
                        template: $filter('translate')('msg_no_changed_barber')
                    });
                }
            });
        };

        $scope.getService = function (params) {

            //console.log( params );

            Services.getBarberServices(params).then(function (result) {

                //console.log( result );

                $scope.barberServices = [];
                if (result != null && result.data != null && result.data.response != null && result.data.response.data != null) {
                    $scope.barberServices = JSON.parse(JSON.stringify(result.data.response.data));
                } else {
                    $ionicPopup.alert({
                        //title: '<h2 class="dark">Info</h2>',
                        template: $filter('translate')('no_service') 
                    });
                }
            });
        };

        $scope.searchTime = function () {

            if ($scope.dataAddAppo.date != null && $scope.dataAddAppo.date != '') {

                $scope.show();
                var params = $scope.dataAddAppo.params;

                var hora = '';
                var today = new Date();
                today = new Date( today.getFullYear(), today.getMonth(), today.getDate());

                var fechaAppo = new Date( $scope.dataAddAppo.date );
                fechaAppo = new Date( fechaAppo.getFullYear(), fechaAppo.getMonth(), fechaAppo.getDate() + 1 );

                if( today.getTime()==fechaAppo.getTime() || today.getTime()===fechaAppo.getTime() ){

                    today = new Date();
                    hora = (today.getHours() + ':' + today.getMinutes());
                }
                params.hora = hora;
                params.fecha = $scope.dataAddAppo.date;
                
                Appointments.searchTimeAvailable(params).then(function successCallback(result) {
                    $scope.timeList = [];
                    if (result != null && result.data != null && result.data.response != null && result.data.response.data != null) {

                        $scope.timeList = JSON.parse(JSON.stringify(result.data.response.data));
                        $scope.hide();
                        //console.log($scope.timeList);
                        if ($scope.timeList == null || $scope.timeList.length <= 0) {
                            $ionicPopup.alert({
                                //title: '<h2 class="dark">Info</h2>',
                                template: $filter('translate')('no_time')
                            });
                        } else {
                            /*
                            $ionicPopup.alert({
                                //title: '<h2 class="dark">Info</h2>',
                                template: ('Time found: ' + $scope.timeList.length + '<br/>Please, choose one')
                            }).then(function (res) {
                            });
                            */
                           
                         //$scope.openSelect( "#selectTime" );
                        }

                    } else {

                        var msg = $filter('translate')('no_time');
                        if (result.data && result.data.response && 
                                result.data.response.message && 
                                result.data.response.message != null && result.data.response.message != '')
                            msg = result.data.response.message;

                        $scope.hide();
                        $ionicPopup.alert({
                            //title: '<h2 class="dark">Info</h2>',
                            template: msg
                        });
                    }
                }, function errorCallback() {
                    $scope.hide();
                    $ionicPopup.alert({
                        //title: '<h2 class="dark">Info<h2>',
                        template: $filter('translate')('no_server_connection')
                    });
                });
            } else {
                $ionicPopup.alert({
                    //title: '<h2 class="dark">Info</h2>',
                    template: $filter('translate')('choose_time')
                });
            }
        };

        $scope.saveAppointment = function () {

            if ((($scope.dataAddAppo != null) &&
                    $scope.dataAddAppo.selectServices != null && $scope.dataAddAppo.selectServices != '') &&
                    ($scope.dataAddAppo.date != null && $scope.dataAddAppo.date != '') &&
                    ($scope.dataAddAppo.selectTime != null && $scope.dataAddAppo.selectTime != '')) {

                $ionicPopup.confirm({
                    //title: '<h2 class="dark">Confirm<h2>',
                    template: $filter('translate')('confirm_save_appo'),
                    //default: 'cancel'
                }).then(function (res) {

                    if (res) {

                        $scope.data = {
                            fecha: $scope.dataAddAppo.date,
                            hora: $scope.dataAddAppo.selectTime,
                            mobile_user_id: $scope.dataAddAppo.params.mobile_user_id,
                            service_id: $scope.dataAddAppo.selectServices.id,
                            valoradicional: document.getElementById("propina").value,
                            tipovaloradicional: 'P',
                            barber_id: $scope.dataAddAppo.params.barber_id,
                            enviadopor: 'client',
                            observaciones: $scope.dataAddAppo.observations
                        };
                        
                        $scope.show();
                        console.log($scope.data);
                        Appointments.saveBarberAppointment($scope.data).then(function successCallback(result) {

                            console.log(result);

                            $scope.hide();

                            if (result != null && result.data != null && result.data.response != null) {
                                if (result.data.response.success == true) {
                                    $ionicPopup.alert({
                                        //title: '<h2 class="dark">Info</h2>',
                                        template: $filter('translate')('saved_appo')
                                    }).then(function (res) {

                                        var hora = '';
                                        var horaSplit = $scope.data.hora.split(":");
                                        if( horaSplit!==null && horaSplit.length>1 ){
                                            hora += ("" + (horaSplit[0]-1) + ":" + horaSplit[1]);
                                        }
                                        
                                        //console.log($scope.data.fecha);
                                        //console.log(hora);
                                        var date_time =   $scope.data.fecha+" "+ $scope.data.hora;
                                        $scope.scheduledNotification(result.data.response.data['Appointment']['id'], date_time);
                                        //$scope.scheduledNotification(result.data.response.data['Appointment']['id'], $scope.data.fecha, hora);
                                        $window.location.reload(true);
                                        $location.path('/app/appointments');
                                        
                                    });
                                } else {
                                    var msg = $filter('translate')('no_saved_appo');
                                    if (result.data.response.message != null && result.data.response.message != '')
                                        msg = result.data.response.message;
                                    $ionicPopup.alert({
                                        //title: '<h2 class="dark">Info</h2>',
                                        template: msg
                                    });
                                }
                            } else {
                                $ionicPopup.alert({
                                    //title: '<h2 class="dark">Info</h2>',
                                    template: $filter('translate')('no_saved_appo')
                                });
                            }
                        }, function errorCallback() {
                            $ionicPopup.alert({
                                //title: '<h2 class="dark">Info<h2>',
                                template: $filter('translate')('no_server_connection')
                            });
                        });
                    }
                });
            } else {
                $ionicPopup.alert({
                    //title: '<h2 class="dark">Info</h2>',
                    template: $filter('translate')('complete_form')+ '( <i class="assertive ion-alert"></i> )'
                });
            }
        };

        $scope.scheduledNotification = function (id, alarm/*, hour*/) {
            //if( !hour || hour==null || hour=='' || hour==='' || hour=="" || hour==="" )
             //   hour = "08:00";
            var at = moment(alarm);
            var alarmTime = new Date(at.subtract(1, 'hours'));
            
            $cordovaLocalNotification.schedule({
                id: id,
                at: alarmTime,
                title: 'BarbersNet',
                text: $filter('translate')('reminder_appo'),
                icon: 'res://icon',
                smallIcon: 'res://ic_bs_pole',
                data: {
                    fecha: 'myFecha'
                }
            }).then(function () {
                console.log('Notification 1 triggered');
            });
        };


        $scope.openSelect = function(selector){
            //alert(selector);
            var element = $(selector)[0], worked = false;
            if (document.createEvent) { // all browsers
               var e = document.createEvent("MouseEvents");
               e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
               worked = element.dispatchEvent(e);
           } else if (element.fireEvent) { // ie
               worked = element.fireEvent("onmousedown");
           }
           if (!worked) { // unknown browser / error
               //alert("It didn't worked in your browser.");
           }   
       };

       /*
       document.getElementById("selectTime").addEventListener("change", function(event){

            console.log( "selectTime change" );
            $scope.openSelect( "#selectServices" );

        }, false);
        */

       $scope.openSelect2 = function(selector){
           console.log( selector );
           $scope.show();
           $scope.hide();
           $scope.openSelect( selector );
       };

    })

    .controller('SearchBarberCtrl', function ($scope, Barbers, $cordovaGeolocation, $stateParams, $ionicLoading, $ionicPopup, $filter) {

        //$ionicNavBarDelegate.showBackButton(true);
        $scope.frommenu = true;
        if( $stateParams.frommenu!=null && $stateParams.frommenu!='' )
            $scope.frommenu = $stateParams.frommenu;

        //console.log( $stateParams );
        //console.log( $scope.frommenu );
        
        $scope.show = function () {
            $ionicLoading.show({
                template: ' <ion-spinner></ion-spinner>'
            });
        };

        $scope.hide = function () {
            $ionicLoading.hide();
        };

        var miLat = '';
        var miLon = '';
        var marker = '';
        
        $scope.mapCreated = function (map) {
            $scope.map = map;
            $scope.centerOn('me');
        };
        
        $scope.centerOn = function (iMarker) {
            
            if (!$scope.map) {
                return;
            }
            
            if (iMarker != 'me')
               $scope.map.setCenter(new google.maps.LatLng($scope.barbers[iMarker].Barber.latitud, $scope.barbers[iMarker].Barber.longitud)); 
            else{
            
                if( (miLat!=null && miLat!=0 && miLat!='NaN') && (miLon!=null && miLon!=0 && miLon!='NaN') )
                    $scope.map.setCenter(new google.maps.LatLng(miLat, miLon));  
                else{
                    
                    $scope.loading = $ionicLoading.show({
                        template: $filter('translate')('current_location'),
                        showBackdrop: false
                    });

                    var posOptions = {timeout: 20000, enableHighAccuracy: false};
                    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (pos) {

                        var infoWindow = new google.maps.InfoWindow();
                        $scope.hide();

                        if (iMarker == 'me') {
                            miLat = pos.coords.latitude;
                            miLon = pos.coords.longitude;

                            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

                            if (marker == '') {

                                marker = new google.maps.Marker({
                                    position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                                    map: $scope.map,
                                    title: 'I am here!',
                                    icon: 'img/user_location.png',
                                    animation: google.maps.Animation.DROP,
                                    draggable: false
                                });

                                google.maps.event.addListener(marker, 'click', function () {
                                    infoWindow.setContent('<h5 class="dark">' + marker.title + '</h5>');
                                    infoWindow.open($scope.map, marker);
                                });
                            }

                        }else 
                            $scope.map.setCenter(new google.maps.LatLng($scope.barbers[iMarker].Barber.latitud, $scope.barbers[iMarker].Barber.longitud));

                        $scope.getBarberBySearch();

                    }, function (error) {

                        $scope.hide();
                        $ionicPopup.alert({
                            //title: '<h2 class="dark">Info<h2>',
                            //template: 'Unable to get location: ' + error.message + '. Please, turn on your location settings'
                            template: $filter('translate')('unable_location')
                        });
                    });
                }
            }
        };

        var muser = JSON.parse(localStorage.getItem('muser_barber'));
        var param = {'mobile_user_id': muser.MobileUser.id};
        $scope.barbers = [];

        $scope.markers = [];
        var infoWindow = new google.maps.InfoWindow();
        
        var createMarker = function (barber) {
            
            //console.log( "createMarker: " + barber.nombrebarberia );
            //console.log( barber.latitud + " , " + barber.longitud );
            
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(barber.latitud, barber.longitud),
                map: $scope.map,
                title: barber.nombrebarberia,
                icon: 'img/barbershop_marker.png'
            });
            marker.content = '<div class="infoWindowContent"><b>'+$filter('translate')('address')+':</b> ' + barber.direccion + '<br/><b>'+$filter('translate')('barber')+':</b> <a href="#/app/barber-preview/'+ barber.id +'" >' + barber.nombre + '</a></div>';
            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent('<h4 class="dark" align="center">' + barber.nombrebarberia + '</h4>' + marker.content);
                infoWindow.open($scope.map, marker);
            });
            $scope.markers.push(marker);
        };
        
        $scope.removeMarkers = function () {
            
            if( $scope.markers!=null ){
                
                for(var i=0; i<$scope.markers.length; i++)
                    $scope.markers[i].setMap(null);
                
            }
        };

        $scope.getBarberBySearch = function () {
            
            $scope.show();
            
            $scope.barbers = null;
            $scope.removeMarkers();
            
            param.latitud = miLat;
            param.longitud = miLon;
            param.radio = $scope.radio.value;
            param.criterio = $scope.criterio.value;
            
            //console.log(param);
            
            Barbers.getSearchBarbers(param).then(function successCallback(result) {
                
                $scope.hide();
                
                //$scope.criterio.value = '';
                
                if (result != null && result.data != null && result.data.response != null && result.data.response.data != null) {
                    
                    $scope.barbers = JSON.parse(JSON.stringify(result.data.response.data));
                    
                    var barberLat = '', barberLon = '';

                    for (var i = 0; i < $scope.barbers.length; i++) {
                        
                        if ($scope.barbers[i].Barber.foto_url == null || $scope.barbers[i].Barber.foto_url == '')
                            $scope.barbers[i].Barber.foto_url = 'img/img_nouser.png';
                        
                        barberLat = $scope.barbers[i].Barber.latitud;
                        barberLon = $scope.barbers[i].Barber.longitud;
                        
                        if( (barberLat!=null && (barberLat<0 || barberLat>0)) && (barberLon!=null && (barberLon<0 || barberLon>0)) ){
                            createMarker($scope.barbers[i].Barber);
                            $scope.barbers[i].Barber.distance = getDistanceFromLatLonInKm(miLat, miLon, barberLat, barberLon);
                        }else
                            $scope.barbers[i].Barber.distance = '';
                    }
                    
                    $scope.barbers = $filter('orderBy')($scope.barbers, 'Barber.distance');
                    
                }else {
                    //alert(result.data.response.message);
                    var msg = $filter('translate')('no_barbers_found');
                    if( result.data.response.message && 
                            result.data.response.message!=null && result.data.response.message!='' )
                    
                    $ionicPopup.alert({
                        //title: '<h2 class="dark">Info<h2>',
                        template: msg
                    });
                }
            }, function errorCallback() {
                
                $scope.hide();
                $ionicPopup.alert({
                    //title: '<h2 class="dark">Info<h2>',
                    template: $filter('translate')('no_server_connection')
                });
            });
        };

        function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2 - lat1);  // deg2rad below
            var dLon = deg2rad(lon2 - lon1);
            var a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2)
                    ;
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c; // Distance in km
            return Math.round(d * 100) / 100;
        };

        function deg2rad(deg) {
            return deg * (Math.PI / 180);
        };

        /*
        $scope.showFilterBar = function () {
            $ionicFilterBar.show({
                cancelText: "<i class='ion-ios-close-outline'></i>",
                items: $scope.barbers,
                update: function (filteredItems, filterText) {
                    $scope.barbers = filteredItems;
                    
                    console.log( filterText );
                }
            });
        };
        */
       
       $scope.criterio = { value: '' };
       
       $scope.showCriteriaPopup = function () {
           
            $ionicPopup.confirm({
                templateUrl: 'searchPopup.html',
                title: '<p class="fontBlack">'+$filter('translate')('search_barbers')+'</p>',
                scope: $scope,
                buttons: [{
                    text: $filter('translate')('menu_4'),
                    type: 'button-positive',
                    onTap: function (e) {
                        //console.log($scope.radio);
                        //console.log( $scope.criterio.value );
                        /*
                        if( $scope.criterio.value!=null && $scope.criterio.value!='' &&
                                $scope.criterio.value.length>2 )
                            $scope.getBarberBySearch();
                        else{

                            $ionicPopup.alert({
                                //title: '<h2 class="dark">Info</h2>',
                                template: 'Please type minimum 2 letters'
                            });
                            e.preventDefault();
                        }
                        */
                       $scope.getBarberBySearch();
                    }
                }, {
                    text: $filter('translate')('cancel'),
                    type: 'button-default',
                    onTap: function (e) {
                      //$state.go('shoppingCart');
                    }
                }
                ]
            });
        };
        
        $scope.radio = {
            value: '10'
        };

        $scope.openRadio = function () {
            $ionicPopup.confirm({
                templateUrl: 'radioPopup.html',
                title: '<p class="fontBlack">'+$filter('translate')('radius')+'</p>',
                scope: $scope,
                buttons: [{
                    text: 'Ok',
                    type: 'button-positive',
                    onTap: function (e) {
                      
                      //console.log($scope.radio);
                      //console.log( $scope.radio.value );
                      $scope.getBarberBySearch();
                    }
                }, {
                    text: $filter('translate')('cancel'),
                    type: 'button-default',
                    onTap: function (e) {
                      
                    }
                }
                ]
            });
        };
        
    })

    .controller('BarberDetailCtrl', function ($scope, Barbers, $state, $window, $ionicLoading, $ionicPopup) {

        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.loading = $ionicLoading.show({
            template: ' <ion-spinner></ion-spinner>',
            showBackdrop: false
        });
        
        $scope.barber = [];
        var muser = JSON.parse(localStorage.getItem('muser_barber'));
        var params = {'mobile_user_id': muser.MobileUser.id, 'barber_id': muser.MobileUser.barber_id};
        
        //console.log()
        
        Barbers.getBarber(params).then(function (result) {
            
            $scope.hide();
            
            if (result != null && result.data != null && result.data.response != null && result.data.response.data != null) {
                
                $scope.barber = JSON.parse(JSON.stringify(result.data.response.data));
                if ($scope.barber.Barber.foto_url == null || $scope.barber.Barber.foto_url == '')
                    $scope.barber.Barber.foto_url = 'img/img_nouser.png';
                
            } else {
                
                $ionicPopup.confirm({
                    title: "<p class='fontBlack'>"+$filter('translate')('no_choosen_barber')+"</p>",
                    scope: $scope,
                    buttons: [{
                        text: $filter('translate')('yes'),
                        type: 'button-positive',
                        onTap: function (e) {
                            
                            $state.go('app.search');
                            $window.location.reload(true);
                        }
                    }, {
                        text: 'No',
                        type: 'button-default',
                        onTap: function (e) {
                            
                            $state.go('app.appointments');
                            $window.location.reload(true);
                        }
                    }
                    ]
                });
                /*
                $ionicPopup.confirm({
                    //title: '<h2 class="dark">Info<h2>',
                    template: "You don't have any default barber. Do you want to search one ?"
                    //default: 'No'
                }).then(function (res) {

                    if (res) {

                        $state.go('app.search');
                        $window.location.reload(true);
                    }
                });
                */
                /*
                $ionicPopup.alert({
                    //title: '<h2 class="dark">Info</h2>',
                    template: 'No Barber was found'
                }).then(function () {
                    $state.go('app.search');
                    $window.location.reload(true);
                });
                */
            }
        });
    })

    .controller('BarberPreviewCtrl', function ($scope, Barbers, $rootScope, $ionicLoading, $stateParams, $ionicPopup) {

        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.loading = $ionicLoading.show({
            template: ' <ion-spinner></ion-spinner>',
            showBackdrop: false
        });
        $scope.barber = [];
        var muser = JSON.parse(localStorage.getItem('muser_barber'));
        var params = {'mobile_user_id': muser.MobileUser.id,'barber_id': $stateParams.barber_id};
        Barbers.getBarber(params).then(function successCallback(result) {
            
            if (result != null && result.data != null && result.data.response != null && 
                    result.data.response.data != null) {
                
                $scope.barber = JSON.parse(JSON.stringify(result.data.response.data));
                if ($scope.barber.Barber.foto_url == null || $scope.barber.Barber.foto_url == '')
                    $scope.barber.Barber.foto_url = 'img/img_nouser.png';
                $rootScope.barber_selected_name = $scope.barber.Barber.nombre;
                $rootScope.barber_currency = $scope.barber.Barber.currency;
            } else {
                $ionicPopup.alert({
                    //title: '<h2 class="dark">Info</h2>',
                    template: $filter('translate')('no_babers_found')
                });
            }
            $scope.hide();
        }, function errorCallback() {
            $scope.hide();
            $ionicPopup.alert({
                //title: '<h2 class="dark">Info<h2>',
                template: $filter('translate')('no_server_connection')
            });
        });
    })

    .controller('ProfileCtrl', function ($scope, MobileUser, $ionicLoading, $ionicPopup, $timeout,$cordovaSocialSharing, $filter) {

        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.loading = $ionicLoading.show({
            template: ' <ion-spinner></ion-spinner>',
            showBackdrop: false
        });
        var muser = JSON.parse(localStorage.getItem('muser_barber'));
        var param = {'muser_id': muser.MobileUser.id};
        $scope.muser = [];
        MobileUser.getMobileUser(param).then(function successCallback(result) {
            if (result != null && result.data != null && result.data.response != null && result.data.response.data != null) {
                $scope.muser = JSON.parse(JSON.stringify(result.data.response.data));
                if ($scope.muser.MobileUser.foto == null || $scope.muser.MobileUser.foto == '')
                    $scope.muser.MobileUser.foto = 'img/img_nouser.png';

                $scope.hide();
            }
            else {
                //alert(result.data.response.message);
                $ionicPopup.alert({
                    //title: '<h2 class="dark">Warning<h2>',
                    template: result.data.response.message
                });
            }
        }, function errorCallback() {
            $scope.hide();
            $ionicPopup.alert({
                //title: '<h2 class="dark">Info<h2>',
                template: $filter('translate')('no_server_connection')
            });
        });
        $scope.showInfoSlide = function () {
            var slideLoading = $ionicLoading.show({
                template: '<p><i class="icon ion-arrow-left-c"/> swipe <i class="icon ion-arrow-right-c"/></p>',
                animation: 'fade-in',
                showBackdrop: false,
                maxWidth: 200,
                showDelay: 500
            });
            $timeout(function () {
                slideLoading.hide();
            }, 2000);
        };
        
        //console.log( muser );

        var code = '';
        if (muser != null ){
            
            if( muser.MobileUser.codigobarberforeferido && muser.MobileUser.codigobarberforeferido != null )
                code = muser.MobileUser.codigobarberforeferido;
            else if( muser.MobileUser.barber_id && muser.MobileUser.barber_id != null )
                code = btoa(muser.MobileUser.barber_id);
        }
        
        //console.log( code );
        
        $scope.shareLinkClients = function(){
            //window.plugins.socialsharing.share("Download BarbersNet Client App and sign in using the code of my barber: " + code + "", null, null, 'https://play.google.com/store/apps/details?id=com.mobolapps.barbersnetclient&hl=en');
            $cordovaSocialSharing.share( $filter('translate')('sharing_msg') + code + "", null, null, 'https://play.google.com/store/apps/details?id=com.mobolapps.barbersnetclient&hl=en');
        };
        
    })


    .controller('ProfileEditCtrl', function ($scope, MobileUser, $ionicHistory, $ionicLoading, 
                        $filter, $ionicPopup, $window, $rootScope) {
        
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        /*
        $scope.loading = $ionicLoading.show({
            template: ' <ion-spinner></ion-spinner>',
            showBackdrop: false
        });
        */
        
        $scope.show = function () {
            $ionicLoading.show({
                template: ' <ion-spinner></ion-spinner>'
            });
        };
        
        var muser = JSON.parse(localStorage.getItem('muser_barber'));
        console.log( muser );
        $scope.muser = muser;
        
        $scope.dataEditProfile = {
            mobile_user_id: $scope.muser.MobileUser.id,
            email: $scope.muser.MobileUser.email,
            name: $scope.muser.MobileUser.nombre,
            phone: $scope.muser.MobileUser.telefono,
            password: $scope.muser.MobileUser.password,
            gender: $scope.muser.MobileUser.sexo,
            //birthdate: new Date(),
            birthdate: $scope.muser.MobileUser.fechanacimiento,
            //barber_code: '',
            observations: $scope.muser.MobileUser.observaciones,
            foto: '',//$scope.muser.MobileUser.foto,
            extensionfoto: 'jpg',
            codigobarbero: $scope.muser.MobileUser.codigobarberoreferido,
            enviadopor: 'client',
            locale: navigator.language,
            tokenpush: ''
        };
        
        //if ($scope.muser.MobileUser.foto == null || $scope.muser.MobileUser.foto == '')
          //  $scope.dataEditProfile.foto = 'img/img_nouser.png';
        var tieneFoto = false;
        $scope.editarreferido = false;
        if ($scope.muser.MobileUser.codigobarberoreferido == null || $scope.muser.MobileUser.codigobarberoreferido == undefined){
            $scope.dataEditProfile.codigobarbero = '';
            $scope.editarreferido = true;
        }
        
        
        $scope.fotocliente = 'img/img_nouser.png';
        if( (muser.MobileUser.foto!=null || muser.MobileUser.foto!==null)
                && (muser.MobileUser.foto!='' || muser.MobileUser.foto!=='') ){
            $scope.fotocliente = muser.MobileUser.foto;
            tieneFoto = true;
        }
        
        
        //console.log( $scope.dataEditProfile );
        
        /*
        var params = {'muser_id': muser.MobileUser.id};
        $scope.muser = [];
        
        MobileUser.getMobileUser(params).then(function successCallback(result) {
            
            $scope.hide();
            
            if (result != null && result.data != null && result.data.response != null && result.data.response.data != null) {
                
                $scope.muser = JSON.parse(JSON.stringify(result.data.response.data));
                $scope.dataEditProfile.id = $scope.muser.MobileUser.id;
                $scope.dataEditProfile.email = $scope.muser.MobileUser.email;
                $scope.dataEditProfile.name = $scope.muser.MobileUser.nombre;
                $scope.dataEditProfile.phone = $scope.muser.MobileUser.telefono;
                $scope.dataEditProfile.password = $scope.muser.MobileUser.password;
                $scope.dataEditProfile.codigobarbero = $scope.muser.Barber.code;
                $scope.dataEditProfile.observations = $scope.muser.MobileUser.observaciones;
                $scope.dataEditProfile.gender = $scope.muser.MobileUser.sexo;
                
                //$scope.dataEditProfile.birthdate = new Date($filter('date')($scope.muser.MobileUser.fechanacimiento));
                $scope.dataEditProfile.birthdate = $scope.muser.MobileUser.fechanacimiento;
                //$scope.dataEditProfile.birthdate = $filter("date")($scope.dataEditProfile.birthdate, 'yyyy-MM-dd');
                
                if ($scope.muser.MobileUser.foto == null || $scope.muser.MobileUser.foto == '')
                    $scope.muser.MobileUser.foto = 'img/img_nouser.png';
                
            } else {
                
                var msg = 'User not found';
                if (result.data.response.message != null && result.data.response.message != '')
                    msg = result.data.response.message;
                
                $ionicPopup.alert({
                    //title: '<h2 class="dark">Info</h2>',
                    template: msg
                });
            }
            
        }, function errorCallback() {
            $scope.hide();
            $ionicPopup.alert({
                //title: '<h2 class="dark">Info<h2>',
                template: $filter('translate')('no_server_connection')
            });
        });
        */

        $scope.editProfile = function () {
            
            var confirmPopup = $ionicPopup.confirm({
                //title: '<h2 class="dark">Confirm<h2>',
                template: $filter('translate')('confirm_edit_info')
            });
            
            confirmPopup.then(function (res) {
                
                if (res) {
                    
                    if (($scope.dataEditProfile != null)) {
                        /*
                        $scope.loading = $ionicLoading.show({
                            template: ' <ion-spinner></ion-spinner>',
                            showBackdrop: false
                        });
                        */
                        $scope.show();
                        //if ($scope.dataEditProfile.birthdate != '')
                            //$scope.dataEditProfile.birthdate = $filter('date')($scope.dataEditProfile.birthdate, "yyyy-MM-dd");
                        
                        //console.log( $scope.dataEditProfile );
                        
                        MobileUser.editMobileUser($scope.dataEditProfile).then(function successCallback(result) {
                            
                            //console.log( result );
                            
                            $scope.hide();
                            
                            if (result != null && result.data != null && result.data.response != null) {
                                
                                if (result.data.response.success == true) {
                                    
                                    localStorage.setItem('muser_barber', JSON.stringify(result.data.response.data));
                                    var muser = localStorage.getItem('muser_barber');
                                    
                                    if (muser != null && muser != '') {
                                        
                                        muser = JSON.parse(localStorage.getItem('muser_barber'));
                                        $rootScope.muserEmail = muser.MobileUser.email;
                                        $rootScope.muserName = muser.MobileUser.nombre;
                                        if (muser.MobileUser.foto != null && muser.MobileUser.foto != '') {
                                            $rootScope.muserFoto = muser.MobileUser.foto;
                                        }
                                        else {
                                            $rootScope.muserFoto = 'img/img_nouser.png';
                                        }
                                    }
                                    
                                    var msg = "User information updated";
                                    if( result.data.response.message && 
                                            result.data.response.message!=null && 
                                            result.data.response.message!='' )
                                        msg = result.data.response.message;
                                    
                                    $ionicPopup.alert({
                                        //title: '<h2 class="dark">Info</h2>',
                                        template: msg
                                    }).then(function (res) {
                                        if (res) {
                                            $ionicHistory.goBack();
                                            $window.location.reload(true);
                                        }
                                    });
                                    
                                } else {
                                    
                                    var msg = "User could not updated";
                                    if (result.data.response.message != null && result.data.response.message != '')
                                        msg = result.data.response.message;
                                   
                                    $ionicPopup.alert({
                                        //title: '<h2 class="dark">Info</h2>',
                                        template: msg
                                    });
                                }
                                
                            } else {
                                
                                var msg = "Opps. something was wrong!";
                                if (result.data.response.message != null && result.data.response.message != '')
                                    msg = result.data.response.message;
                                $ionicPopup.alert({
                                    //title: '<h2 class="dark">Info</h2>',
                                    template: msg
                                });
                            }
                        }, function errorCallback() {
                            
                            $scope.hide();
                            $ionicPopup.alert({
                                //title: '<h2 class="dark">Info<h2>',
                                template: $filter('translate')('no_server_connection')
                            });
                        });
                        
                    } else {
                        $ionicPopup.alert({
                            //title: '<h2 class="dark">Info</h2>',
                            template: $filter('translate')('confirm_form')
                        });
                    }
                }
            });
        };

        $scope.tomarFoto = function () {
            var options = {
                quality: 80,
                destinationType: Camera.DestinationType.DATA_URL,
                targetHeight: 500,
                sourceType: 1,
                encodingType: 0
            };
            navigator.camera.getPicture(onSuccess, onFail, options);
        };
        $scope.cargarFoto = function () {
            var options = {
                quality: 80,
                destinationType: Camera.DestinationType.DATA_URL,
                targetHeight: 500,
                sourceType: 0,
                encodingType: 0
            };
            navigator.camera.getPicture(onSuccess, onFail, options);
        };
        /*
        $scope.borrarFoto = function () {
            var confirmPopup = $ionicPopup.confirm({
                //title: '<h2 class="dark">Confirm<h2>',
                template: 'Do you want delete this picture?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    document.getElementById('foto').src = 'img/img_nouser.png';
                    $scope.dataEditProfile.foto = '';
                }
            });
        };
        */
        var onSuccess = function (DATA_URL) {
            $scope.PicSrc1 = document.getElementById('foto');
            $scope.PicSrc1.src = "data:image/jpeg;base64," + DATA_URL;
            $scope.dataEditProfile.foto = DATA_URL;
            $scope.$apply();
        };
        var onFail = function (e) {
            console.log("On fail " + e);
        };
        
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext("2d");
        
        var my_gradient = ctx.createLinearGradient(0, 0, 0, 170);
        my_gradient.addColorStop(0, "black");
        my_gradient.addColorStop(1, "white");
        ctx.fillStyle = my_gradient;
        ctx.fillRect(20, 20, 200, 200);
        
        
        var imgFoto = document.getElementById("foto");
        imgFoto.onload = function(){

            canvas.height = imgFoto.height;
            canvas.width = imgFoto.width;
            ctx.drawImage(imgFoto, 0, 0, imgFoto.width, imgFoto.height);
        };
        
        //imgFoto.src = $scope.fotobarbero;//$rootScope.barberFoto;
        imgFoto.src = $rootScope.fotocliente;
        imgFoto.onload();
        
       
        $scope.rotateImage = function() {
            
            if( tieneFoto==true ){
            
                ctx.translate(imgFoto.height, 0);

                ctx.rotate(90 * Math.PI / 180);
                ctx.drawImage(imgFoto, 0, 0, imgFoto.width, imgFoto.height);
                console.log(canvas);
                $scope.dataEditProfile.foto = (canvas.toDataURL());

                imgFoto.src = $scope.dataEditProfile.foto;

                if( $scope.dataEditProfile.foto.indexOf('png') > -1 ){

                    $scope.dataEditProfile.extensionfoto = 'png';
                    $scope.dataEditProfile.foto = $scope.dataEditProfile.foto.replace("data:image/png;base64,", "");

                }else if( $scope.dataEditProfile.foto.indexOf('jpeg')>-1 || 
                            $scope.dataEditProfile.foto.indexOf('jpg')>-1 ){

                    $scope.dataEditProfile.extensionfoto = 'jpg';
                    $scope.dataEditProfile.foto = $scope.dataEditProfile.foto.replace("data:image/jpeg;base64,", "");
                }
                
                try{
                    $scope.apply();
                }catch(err){}
            }
        };
        
        
        $scope.onezoneDatepicker = {
            //date: ($scope.date.getFullYear() + '-' + ($scope.date.getMonth()+1) + '-' + $scope.date.getUTCDate()), // MANDATORY                     
            mondayFirst: false,
            disablePastDays: false,
            disableSwipe: false,
            disableWeekend: false,
            showDatepicker: false, //allways visible
            showTodayButton: true,
            calendarMode: false, //only calendar, no button, click on the day call callback() function
            hideCancelButton: false,
            hideSetButton: false,
            //date: $scope.dataEditProfile.birthdate,

            callback: function (value) {

                value = $filter("date")(value, 'yyyy-MM-dd');
                $scope.dataEditProfile.birthdate = value;
            }
        };
        
        /*
        $scope.onezoneDatepicker = {
            mondayFirst: false,
            //disablePastDays: true,
            disableSwipe: false,
            disableWeekend: false,
            showDatepicker: false,
            showTodayButton: true,
            calendarMode: false,
            hideCancelButton: false,
            hideSetButton: false,
            callback: function (value) {
                
                console.log( value );
                
                var fecha = $filter('date')(value, "yyyy-MM-dd");
                $scope.dataEditProfile.birthdate = fecha;
            }
        };
        */
        //$scope.dataEditProfile.birthdate = $filter('date')($scope.dataEditProfile.birthdate, "yyyy-MM-dd");
        
    })


    .controller('ProfileAddCtrl', function ($scope, MobileUser, $state, $ionicLoading, $filter, 
                    $ionicPopup, $rootScope, $ionicHistory, $location) {
        
        var foto = document.getElementById('foto');
        foto.src = 'img/img_nouser.png';
        $scope.dataAddProfile = {
            email: '',
            name: '',
            phone: '',
            password: '',
            gender: '',
            //birthdate: new Date(),
            birthdate: $filter('translate')('no_date'),
            barber_code: '',
            observations: '',
            codigobarbero: '',
            foto: '',
            extensionfoto: 'jpg',
            enviadopor: 'client',
            locale: navigator.language
        };

        $scope.show = function () {
            $ionicLoading.show({
                template: ' <ion-spinner></ion-spinner>'
            });
        };
        
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.addProfile = function () {
            
            var confirmPopup = $ionicPopup.confirm({
                ////title: '<h2 class="dark">Confirm<h2>',
                template: $filter('translate')('confirm_create_acount')
            });
            
            confirmPopup.then(function (res) {
                
                if (res) {
                    
                    //if (($scope.dataAddProfile != null)) {
                    if( $scope.dataAddProfile != null &&
                        ( $scope.dataAddProfile.email != null && $scope.dataAddProfile.email != '' ) &&
                        ( $scope.dataAddProfile.name != null && $scope.dataAddProfile.name != '' ) &&
                        ( $scope.dataAddProfile.password != null && $scope.dataAddProfile.password != '' ) &&
                        ( $scope.dataAddProfile.phone != null && $scope.dataAddProfile.phone != '' )
                    ){
                        
                        $scope.show();
                        
                        if ($scope.dataAddProfile.birthdate != '')
                            $scope.dataAddProfile.birthdate = $filter('date')($scope.dataAddProfile.birthdate, "yyyy-MM-dd");
                        
                        
                        //console.log( $scope.dataAddProfile );
                        
                        MobileUser.addMobileUser($scope.dataAddProfile).then(function successCallback(result) {
                            
                            //console.log(result);
                            $scope.hide();
                            
                            if (result != null && result.data != null && result.data.response != null) {
                                
                                if (result.data.response.success == true) {
                                    
                                    localStorage.setItem('muser_barber', JSON.stringify(result.data.response.data));
                                    var muser = localStorage.getItem('muser_barber');
                                    
                                    if (muser != null && muser != '') {
                                        
                                        muser = JSON.parse(localStorage.getItem('muser_barber'));
                                        $rootScope.muserEmail = muser.MobileUser.email;
                                        $rootScope.muserName = muser.MobileUser.nombre;
                                        
                                        if (muser.MobileUser.foto != null && muser.MobileUser.foto != '') 
                                            $rootScope.muserFoto = muser.MobileUser.foto;
                                        else 
                                            $rootScope.muserFoto = 'img/img_nouser.png';
                                        
                                    }
                                    
                                    $ionicPopup.alert({
                                        //title: '<h2 class="dark">Info</h2>',
                                        template: $filter('translate')('welcome_msg')
                                    }).then(function (res) {
                                        if (res) {
                                            //$state.go('app.search');
                                            //$state.go('app.appointments');
                                            //$window.location.reload(true);
                                            
                                            $ionicHistory.nextViewOptions({
                                                disableAnimate: true,
                                                disableBack: true,
                                                historyRoot: true
                                            });
                                            
                                            $location.path('/app/appointments');
                                        }
                                    });
                                    
                                } else {
                                    
                                    var msg = "User could not saved";
                                    
                                    if (result.data.response.message != null && result.data.response.message != '')
                                        msg = result.data.response.message;
                                    
                                    $ionicPopup.alert({
                                        //title: '<h2 class="dark">Info</h2>',
                                        template: msg
                                    });
                                }
                            } else {
                                var msg = "Opps. something was wrong!";
                                if (result.data.response.message && 
                                        result.data.response.message != null && 
                                        result.data.response.message != '')
                                    msg = result.data.response.message;
                                $ionicPopup.alert({
                                    //title: '<h2 class="dark">Info</h2>',
                                    template: msg
                                });
                            }
                        }, function errorCallback() {
                            
                            $ionicPopup.alert({
                                //title: '<h2 class="dark">Info<h2>',
                                template: $filter('translate')('no_server_connection')
                            });
                        });

                    } else {
                        $ionicPopup.alert({
                            //title: '<h2 class="dark">Info</h2>',
                            template: $filter('translate')('complete_form')+ '( <i class="assertive ion-alert"></i> )'
                        });
                    }
                };
            });
        };

        $scope.tomarFoto = function () {
            var options = {
                quality: 80,
                destinationType: Camera.DestinationType.DATA_URL,
                targetHeight: 500,
                sourceType: 1,
                encodingType: 0
            };
            navigator.camera.getPicture(onSuccess, onFail, options);
        };
        $scope.cargarFoto = function () {
            var options = {
                quality: 80,
                destinationType: Camera.DestinationType.DATA_URL,
                targetHeight: 500,
                sourceType: 0,
                encodingType: 0
            };
            navigator.camera.getPicture(onSuccess, onFail, options);
        };
        
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext("2d");
        
        var my_gradient = ctx.createLinearGradient(0, 0, 0, 170);
        my_gradient.addColorStop(0, "black");
        my_gradient.addColorStop(1, "white");
        ctx.fillStyle = my_gradient;
        ctx.fillRect(20, 20, 200, 200);
       
        var imgFoto = document.getElementById("foto");
        
        if( imgFoto!==null ){
            imgFoto.onload = function(){

                canvas.height = imgFoto.height;
                canvas.width = imgFoto.width;
                ctx.drawImage(imgFoto, 0, 0, imgFoto.width, imgFoto.height);
            };
        }
        
        $scope.rotateImage = function() {
            
            if( $scope.dataAddProfile.foto && $scope.dataAddProfile.foto!=null &&
                    $scope.dataAddProfile.foto!='' ){
            
                ctx.translate(imgFoto.height, 0);

                ctx.rotate(90 * Math.PI / 180);
                ctx.drawImage(imgFoto, 0, 0, imgFoto.width, imgFoto.height);

                $scope.dataAddProfile.foto = (canvas.toDataURL());

                imgFoto.src = $scope.dataAddProfile.foto;

                if( $scope.dataAddProfile.foto.indexOf('png') > -1 ){

                    $scope.dataAddProfile.extensionfoto = 'png';
                    $scope.dataAddProfile.foto = $scope.dataAddProfile.foto.replace("data:image/png;base64,", "");

                }else if( $scope.dataAddProfile.foto.indexOf('jpeg')>-1 || 
                            $scope.dataAddProfile.foto.indexOf('jpg')>-1 ){

                    $scope.dataAddProfile.extensionfoto = 'jpg';
                    $scope.dataAddProfile.foto = $scope.dataAddProfile.foto.replace("data:image/jpeg;base64,", "");
                }
                
                try{
                    $scope.apply();
                }catch(err){}
            }
        };
        
        $scope.borrarFoto = function () {
            var confirmPopup = $ionicPopup.confirm({
                ////title: '<h2 class="dark">Confirm<h2>',
                template: $filter('translate')('confirm_del_pic')
            });
            confirmPopup.then(function (res) {
                if (res) {
                    document.getElementById('foto').src = 'img/img_nouser.png';
                    $scope.dataAddProfile.foto = '';
                }
            });
        };
        
        var onSuccess = function (DATA_URL) {
            $scope.PicSrc1 = document.getElementById('foto');
            $scope.PicSrc1.src = "data:image/jpeg;base64," + DATA_URL;
            $scope.dataAddProfile.foto = DATA_URL;
            $scope.$apply();
        };
        var onFail = function (e) {
            console.log("On fail " + e);
        };
        
        $scope.onezoneDatepicker = {
            //date: ($scope.date.getFullYear() + '-' + ($scope.date.getMonth()+1) + '-' + $scope.date.getUTCDate()), // MANDATORY                     
            mondayFirst: false,
            disablePastDays: false,
            disableSwipe: false,
            disableWeekend: false,
            showDatepicker: false, //allways visible
            showTodayButton: true,
            calendarMode: false, //only calendar, no button, click on the day call callback() function
            hideCancelButton: false,
            hideSetButton: false,
            //date: $scope.dataEditProfile.birthdate,

            callback: function (value) {

                value = $filter("date")(value, 'yyyy-MM-dd');
                $scope.dataAddProfile.birthdate = value;
            }
        };
        
        $scope.abrirPopup = function (tipo) {
            
            var msg = '';
            
            switch(tipo){
                case 'referralcode':
                    msg = 'This is the code of your barber. You can check it out into the link he shared you for downloading this app or ask your him for it.';
                break;
                case 'comments':
                    msg = 'Describe your hair style preferences or something important you need your barber know.';
                break;
                
                default:
                    msg = '';
            }
            
            $ionicPopup.alert({
                    //title: '<h2 class="dark">Info</h2>',
                    template: msg
                });
        };

    })
    


.controller('PostsCtrl', function ($scope,$sce, Posts, $ionicLoading, $ionicPopup, $window,$cordovaSocialSharing, $filter) {

        $scope.dataSearch = {
            type_content: '',
            criterio: ''
        };
            
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        $scope.loading = $ionicLoading.show({
            template: ' <ion-spinner></ion-spinner>',
            showBackdrop: false
        });
        
        $scope.trustSrc = function(src) {
           return $sce.trustAsResourceUrl(src);
        }
        
        $scope.getPosts = function(){
            var muser = JSON.parse(localStorage.getItem('muser_barber'));
            var param = {'barber_id': muser.MobileUser.barber_id, 'type_content': $scope.dataSearch.type_content, 'criterio': $scope.dataSearch.criterio};
            $scope.posts = [];
            Posts.getPosts(param).then(function successCallback(result) {
                if (result != null && result.data != null && result.data.response != null && result.data.response.data != null) {
                    $scope.posts = JSON.parse(JSON.stringify(result.data.response.data));
                    //if ($scope.muser.MobileUser.foto == null || $scope.muser.MobileUser.foto == '')
                        //$scope.muser.MobileUser.foto = 'img/img_nouser.png';;
                        for(var i = 0; i < $scope.posts.length; i++){
                            var str_post_id = "-"+$scope.posts[i].Post.id+"-";
                            var ids_like = localStorage.getItem('muser_posts_ids');
                            if (ids_like != null && ids_like.indexOf(str_post_id)!=-1) {
                                $scope.posts[i].Post.class =  "button button-small button-icon fontWhite icon ion-heart";
                            }
                            else{
                                $scope.posts[i].Post.class =  "button button-small button-icon fontWhite icon ion-heart-broken";
                            }
                        }
                    $scope.hide();
                }
                else {
                    //alert(result.data.response.message);
                    $ionicPopup.alert({
                        //title: '<h2 class="dark">Warning<h2>',
                        template: result.data.response.message
                    });
                }
            }, function errorCallback() {
                $scope.hide();
                $ionicPopup.alert({
                    //title: '<h2 class="dark">Info<h2>',
                    template: $filter('translate')('no_server_connection')
                });
            });
        };
        $scope.getPosts();    
       
        $scope.sharePost = function(post){
            //window.plugins.socialsharing.share("Download BarbersNet Client App and sign in using the code of my barber: " + code + "", null, null, 'https://play.google.com/store/apps/details?id=com.mobolapps.barbersnetclient&hl=en');
           
            if(post.type_post == 'video'){
                var link = "https://youtu.be/"+post.content_post;
                $cordovaSocialSharing.share( "[Barbers.Net] "+post.descripcion , "[Barbers.Net]", null, link);
            }
            else{
                var file = post.content_post;
                $cordovaSocialSharing.share( "[Barbers.Net] "+post.descripcion , "[Barbers.Net]", file, null);
            }
        };
        $scope.doRefresh = function(){
            $window.location.reload(true);
        }
        
        $scope.setLike = function(post_id, likes, index){
            var str_post_id = "-"+post_id+"-";
            var ids_like = localStorage.getItem('muser_posts_ids');
            var icon = '';
            var sum_likes = 0;
            if (ids_like != null && ids_like.indexOf(str_post_id)!=-1) {
                icon = 'ion-heart-broken';
                ids_like = ids_like.replace(str_post_id, '');            
                if(likes > 0)
                    sum_likes = parseInt(likes) - 1;
            }else{
                icon = 'ion-heart';
                ids_like = ids_like + str_post_id;
                sum_likes = parseInt(likes) + 1;
            }
            var params = {'post_id': post_id,'likes': sum_likes};
            Posts.setLike(params).then(function successCallback(result) {
                $scope.posts[index].Post.likes = sum_likes;
            }, function errorCallback() {
                
                $ionicPopup.alert({
                    template: $filter('translate')('no_server_connection')
                });
            });
            document.getElementById('post'+post_id).className = "button button-small button-icon fontWhite icon "+icon;
            localStorage.setItem('muser_posts_ids', ids_like);
        };
        $scope.showSearchPopup = function() {
            
            var myPopup = $ionicPopup.show({
               templateUrl: 'searchPopup.html',
               title: $filter('translate')('search'),
               scope: $scope,

               buttons: [
                {
                    text: $filter('translate')('cancel'),
                    type: 'button-default',
                    onTap: function (e) {
                         
                    }
                }, {
                     text: '<b>OK</b>',
                     type: 'button-positive',
                     onTap: function(e) {
                        $scope.getPosts();
                     }
                  }
               ]
            });

            myPopup.then(function(res) {
               console.log($scope.dataSearch);
            });    
         };
    });
