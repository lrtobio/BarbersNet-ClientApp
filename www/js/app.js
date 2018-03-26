var app = angular.module('starter', ['ionic','ngCordova','ionic.service.core','ionic.service.push', 'starter.controllers', 'starter.services', 'starter.directives', 'onezone-datepicker','angularMoment','pascalprecht.translate']);
app.run(function($ionicPlatform,Appointments, $timeout, $rootScope, $location, $ionicPopup, $ionicHistory, $window, $ionicLoading,$cordovaLocalNotification, MobileUser, $filter) {
    
$ionicPlatform.ready(function(){
    if(window.Connection) {        
        if(navigator.connection.type == Connection.NONE) {            
            $ionicPopup.alert({
                title: "<h4 class='dark'>Failed connection<h4>",
                template: '<center><span class="icon ion-cloud" style="font-size:60px; color: #373737"></span><h4 class="dark">There is no Internet</h4></center>'
            })
            .then(function(result) {
                if(!result) {
                    ionic.Platform.exitApp();
                }
            });
        }
    }
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    if(device.platform === "iOS") {
        window.plugin.notification.local.promptForPermission();
    }
    
    window.cordova.plugins.notification.local.on('schedule', function (notification, state) {
        $timeout(function () {
            $rootScope.$broadcast('$cordovaLocalNotification:schedule', notification, state);
        });
    });
    window.cordova.plugins.notification.local.on('cancel', function (notification, state) {
        $timeout(function () {
            $rootScope.$broadcast('$cordovaLocalNotification:cancel', notification, state);
        });
    });
    window.cordova.plugins.notification.local.on('trigger', function (notification, state) {
        $timeout(function () {
            $rootScope.$broadcast('$cordovaLocalNotification:trigger', notification, state);
        });
    });
    window.cordova.plugins.notification.local.on('click', function (notification, state) {
        console.log(notification);
        //$location.path('/app/appointment/'+notification.id);
        $location.path('/app/appointment2/'+notification.id + '/true');
        $timeout(function () {
          $rootScope.$broadcast('$cordovaLocalNotification:click', notification, state);
        });
    });
    scheduledNotification = function (id, alarm/*, hour*/) {
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
                       /*
                       if( $ionicHistory.currentView().stateName &&
                                $ionicHistory.currentView().stateName!=null &&
                                     $ionicHistory.currentView().stateName!='' ){
                             if( $ionicHistory.currentView().stateName=='app.appointments2' )
                                 $window.location.href = ('#/app/appointments3/' + appointment_id + '/' + fecha);
                             else  
                                 $window.location.href = ('#/app/appointments2/' + appointment_id + '/' + fecha);

                         }else
                             $window.location.href = ('#/app/appointments2/' + appointment_id + '/' + fecha);*/
                        
                        $window.location.href = ('#/app/appointment/' + appointment_id);
                        scheduledNotification(appointment_id, fecha);
                        //$location.path('/app/appointments2/' + appointment_id + '/' + fecha);
                        //$state.transitionTo($state.current, $stateParams, {reload:true, inherit:false})
                        //$window.location.reload(true);
                        //$state.go('app.appointments2');
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
                            if (appointment_id != '') {

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
        console.log("Device token app:", token);

        if( token.token && token.token!=null && token.token!='' ){

            push.saveToken(token);  // persist the token in the Ionic Platform
            var updateUserToken = false;
            //var barber = JSON.parse(localStorage.getItem('Barber'));
            //f( barber!=null && barber!='' && barber!='null' ){
                var muser= JSON.parse(localStorage.getItem('muser_barber'));
                console.log("MobileUser token app:", muser.MobileUser.tokenpush);

                if( muser.MobileUser && muser.MobileUser.tokenpush && muser.MobileUser.tokenpush!=null && 
                        muser.MobileUser.tokenpush!='' && muser.MobileUser.tokenpush!='undefined'){
                    if( muser.MobileUser.tokenpush!=token.token )
                        updateUserToken = true;
                }else
                    updateUserToken = true;
            //}
            if( updateUserToken==true ){
                show = function () {
                    $ionicLoading.show({
                        template: '<ion-spinner></ion-spinner>'
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
                    phone: '',
                    foto:'',
                    password: '',
                    birthdate: '',
                    observations: '',
                    extensionfoto: '',
                    gender:'',
                    creadorpor:'',
                    codigobarbero:'',
                    enviadopor: 'client',
                    locale: ''
                };
                //console.log('app');
                //console.log(muserData);
                show();
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
});

    validar_citas = function (){
        var muser = JSON.parse(localStorage.getItem('muser_barber'));
        console.log(muser);
        
        var op = false;
        if(muser != null){
            var params = {'mobile_user_id': muser.MobileUser.id};
            Appointments.getAppointmentList(params).then(function successCallback(result) {
                if (result.data.response.success == true && result.data.response.data != null) {
                    op = true;
                } 
            }, function errorCallback() {

            });
            return op;
        }
        
    };
    
    localStorage.setItem('validar_citas', validar_citas());
});


app.config(function($stateProvider, $urlRouterProvider, $translateProvider) {
  $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })
  
    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'AppCtrl'
            }
        }
    })
    
    .state('app.appointments', {
        url: '/appointments',
        views: {
            'menuContent': {
                templateUrl: 'templates/appointments.html',
                controller: 'AppointmentsCtrl'
            }
        }
    })
    
    .state('app.appointment-add', {
    url: '/appointment-add/:barber_id',
    views: {
      'menuContent': {
        templateUrl: 'templates/appointment-add.html',
        controller: 'AppointmentAddCtrl'
      }
    }
  })
  .state('app.search', {
    url: '/search/:frommenu',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'SearchBarberCtrl'
      }
    }
  })
  
  .state('app.searchBack', {
    url: '/searchBack/:frommenu',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'SearchBarberCtrl'
      }
    }
  })

  .state('app.barber', {
      url: '/barber',
      views: {
        'menuContent': {
          templateUrl: 'templates/barber.html',
          controller: 'BarberDetailCtrl'
        }
      }
    })
    .state('app.appointment', {
        url: '/appointment/:appointment_id',
        views: {
            'menuContent': {
                templateUrl: 'templates/appointment.html',                
                controller: 'AppointmentDetailCtrl'
            }
        }
    })
    
    .state('app.appointment2', {
        url: '/appointment2/:appointment_id/:esrecordatorio',
        views: {
            'menuContent': {
                templateUrl: 'templates/appointment.html',
                controller: 'AppointmentDetailCtrl'
            }
        }
    })
    
    .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })
    .state('app.profile-edit', {
      url: '/profile-edit',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile-edit.html',
          controller: 'ProfileEditCtrl'
        }
      }
    })
    .state('app.profile-add', {
      url: '/profile-add',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile-add.html',
          controller: 'ProfileAddCtrl'
        }
      }
    })
    .state('app.barber-preview', {
      url: '/barber-preview/:barber_id',
      views: {
        'menuContent': {
          templateUrl: 'templates/barber-preview.html',
          controller: 'BarberPreviewCtrl'
        }
      }
    })
    .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'templates/about.html',
          
        }
      }
    })
    .state('app.posts', {
            url: '/posts',
            views: {
                'menuContent': {
                    templateUrl: 'templates/posts.html',
                    controller: 'PostsCtrl'
                }
            }
        })
    .state('app.welcome', {
        url: '/welcome',
        views: {
            'menuContent': {
                templateUrl: 'templates/welcome.html',
                controller: 'AppCtrl'
            }
        }
    });
    var muser = localStorage.getItem('muser_barber');
    var lc = navigator.language;
    if(lc.length > 2){
        lc = lc.split('-');
        lc = lc['0'];
    }
            
    console.log('navigator language:'+lc);
    
    if( muser!=null && muser!='' ){
        
        muser = JSON.parse(localStorage.getItem('muser_barber'));
        if(muser.MobileUser.locale != null)
            lc = muser.MobileUser.locale;
        /*if(muser.MobileUser.barber_id === 0 || muser.MobileUser.barber_id === '' ||
                muser.MobileUser.barber_id === null || muser.MobileUser.barber_id == null || 
                muser.MobileUser.barber_id == 'null' || muser.MobileUser.barber_id === 'null'){*/
        var validar_cita = localStorage.getItem('validar_citas');
        console.log("cita: " + validar_cita);
        if(validar_cita){
             
            //$urlRouterProvider.otherwise('/app/search/true');  
            $urlRouterProvider.otherwise('/app/appointments');
        }else
            $urlRouterProvider.otherwise('/app/posts'); 
        
        //$urlRouterProvider.otherwise('/app/appointments'); 
    }else{
        $urlRouterProvider.otherwise('/app/login');
        //$urlRouterProvider.otherwise('/app/welcome');
    }
    
    
    
    $translateProvider.translations('en', {
            menu_1: "My Appointments",
            menu_2: "My Profile",
            menu_3: "My Barber",
            menu_4: "Search",
            menu_5: "About...",
            menu_6: "Posts",
            barber: "Barber",
            barbershop: "BarberShop",
            appointment: "Appointment",
            detail_appo: "Appointment Detail",
            new: "New",
            set_date: "Set Date",
            service: "Service",
            points: "Points",
            obs: "Observations",
            add: "Schedule",
            select_time: "Select Time",
            select_service: "Select Service",
            obs_ph: "Write here something important",
            no_date: "No date selected",
            phone: "Phone",
            client_since: "Client_since",
            sharing_msg: "Download BarbersNet Client App and sign in using the code of my barber: ",
            edit: "Edit",
            password: "Password",
            gender: "Gender",
            male: "Male",
            female: "Female",
            birthdate: "Birthdate",
            save: "Save",
            sign_up: "Sign Up",
            email: "E-Mail",
            email_obs: "It will be your username",
            password_obs: "It will be your password",
            name: "Name",
            full_name: "Full Name",
            optional: "Optional",
            required: "Required",
            barber_ref_code: "Barber referal code",
            comments: "Comments",
            login: "Login for Clients",
            sign_in: "Sign In",
            create_account: "Create New Account",
            forgot_password: "Did you forget your password?",
            enter_email: "Enter your E-mail",
            pending_appo: "No pending appointments were found",
            address: "Address",
            current_location: "Getting current location",
            slogan_barber: "An App from Barbers to Barbers",
            developed_by: "Developed by",
            sign_out_msg: "Are you sure you want to sign out?",
            error_login: "Failed login, please try again!",
            complete_login: "Please, type your username and password",
            verify_connection: "Please verify your internet connection and try again",
            type_email: "You must type a valid email",
            no_appo: "No appointment was found",
            no_appo_list: "No appointments were found",
            no_server_connection: "There is no connection with server",
            type_reasons: "Please type the reasons",
            confirm_delete: "Are you sure you want delete this appointment?",
            error_delete: "Appointment couldn't be deleted",
            no_choosen_barber: "You don't have a choosen barber. Do you want to search for one?",
            change_barber: " is not your choosen barber.<br/>Do you want to change ?",
            msg_changed_barber: "Barber was changed",
            msg_no_changed_barber: "Barber couldn't be changed",
            no_service: "No service was found",
            no_time: "No time available was found",
            choose_time: "Choose an avalaible time",
            confirm_save_appo: "Are you sure you want to save this appointment ?",
            saved_appo: "Appointment saved successfully",
            no_saved_appo: "Appointment couldn't be saved",
            complete_form: "Please complete the form",
            unable_location: "Unable to get location. Please, turn on your location settings",
            no_barbers_found: "No barbers were found",
            search_barbers: "Search Barbers",
            radius: "Radius",
            confirm_edit_info: "Are you sure you want to edit this info?",
            confirm_create_account: "Are you sure you want create your account?",
            welcome_msg: "User information saved.<br/><b>Welcome to BarbersNet!</b>",
            confirm_del_pic: "Do you want delete this picture?",
            cancel: "Cancel",
            send: "Send",
            yes: "Yes",
            reminder_appo: "Hey! you have an appointment scheduled",
            distance: "Distance",
            type_criteria: "Type the barber name, code or barbershop name",
            cancel_appo: "Appointment canceled",
            discount: "Discount",
            tip: "Tip",
            search: 'Search',
            all_sections: 'All Sections',
            news: "News",
            promos: "Promos",
            sales: "Sales",
            vacancies: "Vacancies",
        });
    $translateProvider.translations('es', {
            menu_1: "Mis Citas",
            menu_2: "Mi Perfil",
            menu_3: "Mi Barbero",
            menu_4: "Buscar",
            menu_5: "Acerca de...",
            menu_6: "Publicaciones",
            barber: "Barbero",
            barbershop: "Barbería",
            appointment: "Cita",
            detail_appo: "Detalle de Cita",
            new: "Agregar",
            set_date: "Elige una Fecha",
            service: "Servicios",
            points: "Puntos",
            obs: "Observaciones",
            add: "Agendar",
            select_time: "Escoge una Hora",
            select_service: "Escoge un Servicio",
            obs_ph: "Escribe aquí algo importante",
            no_date: "Sin Fecha",
            phone: "Teléfono",
            client_since: "Cliente desde",
            sharing_msg: "Descarga la aplicación BarbersNet para Clientes y registrate con el código de mi Barbero: ",
            edit: "Editar",
            password: "Contraseña",
            gender: "Sexo",
            male: "Masculino",
            female: "Femenino",
            birthdate: "Fecha de nacimiento",
            save: "Guardar",
            sign_up: "Registro",
            email: "E-Mail",
            email_obs: "Este será tu usuario",
            password_obs: "Esta será contraseña",
            name: "Nombre",
            full_name: "Tu nombre completo",
            optional: "Opcional",
            required: "Obligatorio",
            barber_ref_code: "Codigo de referencia barbero",
            comments: "Comentarios",
            login: "Login para Clientes",
            sign_in: "Ingresar",
            create_account: "Crear nueva cuenta",
            forgot_password: "Olvidaste tu contraseña?",
            enter_email: "Ingresa tu E-mail",
            pending_appo: "No se encontraron citas pendientes",
            address: "Dirección",
            current_location: "Obteniendo ubicación actual",
            slogan_barber: "Una aplicación de barberos para barberos",
            developed_by: "Desarrollado por",
            sign_out_msg: "Estás seguro que deseas cerrar sesión?",
            error_login: "Error de inicio de sesión, inténtelo de nuevo!",
            complete_login: "Por favor, escriba su nombre de usuario y contraseña",
            verify_connection: "Verifique su conexión a Internet y vuelva a intentarlo",
            type_email: "Debe escribir un correo electrónico válido",
            no_appo: "No se encontró cita",
            no_appo_list: "No se encontraron citas",
            no_server_connection: "No hay conexión con el servidor",
            type_reasons: "Por favor escribe los motivos",
            confirm_delete: "¿Seguro que quieres eliminar esta cita?",
            error_delete: "No se pudo eliminar la cita",
            no_choosen_barber: "No tienes un barbero elegido. ¿Desea buscar uno?",
            change_barber: " no es tu barbero elegido.<br/>¿Quieres cambiarlo?",
            msg_changed_barber: "Tu barbero fue cambiado",
            msg_no_changed_barber: "Tu barbero no se pudo cambiar",
            no_service: "No se encontró servicio",
            no_time: "No se encontró tiempo disponible",
            choose_time: "Elija una hora disponible",
            confirm_save_appo: "¿Seguro que desea guardar esta cita?",
            saved_appo: "Cita enviada exitosamente",
            no_saved_appo: "No se pudo guardar la cita",
            complete_form: "Por favor, complete el formulario",
            unable_location: "No se puede obtener la ubicación. Por favor, active la configuración de su ubicación",
            no_barbers_found: "No se encontraron barberos",
            search_barbers: "Buscar Barberos",
            radius: "Radio",
            confirm_edit_info: "¿Estas seguro que deseas editar esta información?",
            confirm_create_account: "¿Seguro que quieres crear tu cuenta?",
            welcome_msg: "Información de usuario guardada.<br/><b>Beinvenido a BarbersNet!</b>",
            confirm_del_pic: "¿Quieres eliminar esta imagen?",
            cancel: "Cancelar",
            send: "Enviar",
            yes: "Sí",
            reminder_appo: "¡Oye! Tienes una cita programada",
            distance: "Distancia",
            type_criteria: "Escriba el nombre del barbero, el código o el nombre de la barbería",
            cancel_appo: "Cita cancelada",    
            discount: "Descuento",
            tip: "Propina",
            search: 'Búsqueda',
            all_sections: 'Todas las secciones',
            news: "Noticias",
            promos: "Promociones",
            sales: "Ventas",
            vacancies: "Vacantes",
    });
    
    $translateProvider.preferredLanguage(lc);
    $translateProvider.fallbackLanguage(lc);
    
    moment.locale(lc);
});


