var wsUrlBase = 'http://www.barbersnet.com/backend/web_service_clients/';
var wsUrlBaseBarbers = 'http://www.barbersnet.com/backend/web_service/';
var wsExt = '.json';

var wsMobileUserGetLogin    =            'barbersnet_login';
var wsMobileUserView        =            'musers_view';
var wsMobileUserEdit        =            'musers_edit';
var wsMobileUserUpdateBarber =           'musers_update_barber';
var wsMobileUserRegister    =            'musers_add';

var wsSaveBarberAppointment =            'appointments_addOrEdit';
var wsDeleteAppointment     =            'appointments_delete';
var wsCancelAppointment     =            'musers_appointments_cancel';
var wsAppointmentList       =            'musers_appointments_list';
var wsAppointmentDetail     =            'musers_appointment_details';
var wsAppointmentsHorasDisponibleFecha = 'appointments_horasdisponiblesfecha';

var wsGetService            =            'service_view';
var wsServicesList          =            'services_list';
var wsBarberServices        =            'barbers_services';
var wsAvailableService      =            'barbers_availableservices';
var wsBarberRememberPassword =           'barbers_rememberpassword';

var wsBarberDetail          =            'musers_barber_details';
var wsBarberSearch          =            'musers_barbers_search';

var wsPostsList             =            'posts_list';              
var wsPostsLike             =            'posts_like';

angular.module('starter.services', [])

.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.timeout = 10*1000;
}])

.factory('App', function($http, $rootScope, $stateParams) {
    var doLogin = function($data) {
        
        return $http({
            method: 'POST',
            url: wsUrlBaseBarbers + wsMobileUserGetLogin + wsExt,
            data: 'email=' + $data.email + '&password=' + $data.password 
                    + '&enviadopor=' + $data.enviadopor 
                    + '&locale=' + $data.locale +"&nothing=",
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
                'Access-Control-Allow-Origin': "*"
            },
            timeout: 30000
        });        
    };
    
    return {        
        login: doLogin
    };
 })
 

.factory('Appointments', function($http, $rootScope, $stateParams) {
    
    var searchInfoTimeAvailable = function($data) {        
        
        //console.log( wsUrlBase + wsAppointmentsHorasDisponibleFecha + wsExt );
        //console.log( $data );
        return $http({
            method: 'POST',
            //url: wsUrlBase + wsAppointmentsHorasDisponibleFecha + wsExt,
            url: wsUrlBaseBarbers + wsAppointmentsHorasDisponibleFecha + wsExt,
            data: (
                    'barber_id=' + $data.barber_id + 
                    '&fecha=' + $data.fecha + 
                    '&hora=' + $data.hora + 
                    "&nothing="
                ),
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            timeout: 30000    
        });
    };
    
    var saveBarberAppointmentInfo = function($data) {
        return $http({
            method: 'POST',
            url: wsUrlBaseBarbers + wsSaveBarberAppointment + wsExt,
            data:   
                    /*
                    "barber_id="        + $data.barber_id + 
                    "&mobile_user_id="  + $data.client + 
                    "&service_id="      + $data.service_id + 
                    "&fecha="           + $data.fecha + 
                    "&hora="            + $data.hora +
                    "&accion="          + $data.accion +
                    "&observaciones="   + encodeURIComponent($data.observaciones) +
                    "&nothing=",
                    */
            
                    //"appointment_id="   + $data.appointment_id +
                    "barber_id="        + $data.barber_id + 
                    "&mobile_user_id="  + $data.mobile_user_id + 
                    "&service_id="      + $data.service_id + 
                    "&tipovaloradicional=" + $data.tipovaloradicional +
                    "&valoradicional="  + $data.valoradicional +
                    "&fecha="           + $data.fecha + 
                    "&hora="            + $data.hora +
                    "&enviadopor="      + $data.enviadopor +
                    "&accion="          + $data.accion +
                    //"&descuento="       + $data.descuento +
                    "&observaciones="   + encodeURIComponent($data.observaciones) +
                    "&nothing=",
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            timeout: 40000   
        });
    };
        
    var getInfoAppointmentList = function($data) {       
        return $http({
            method: 'POST',
            url: wsUrlBaseBarbers + wsAppointmentList + wsExt,
            data:   (
                        "mobile_user_id=" + $data.mobile_user_id +
                        "&nothing="
                    ),
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            timeout: 30000   
        });
    };
    
    var getInfoAppointmentDetail = function($data) {       
        return $http({
            method: 'POST',
            url: wsUrlBaseBarbers + wsAppointmentDetail + wsExt,
            data:   (
                        "appointment_id=" + $data.appointment_id +
                        "&mobile_user_id=" + $data.mobile_user_id +
                        "&nothing="
                    ),
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            timeout: 30000   
        });
    };
    
    var deleteInfoAppointment = function($data) {
       
        return $http({
            method: 'POST',
            url: wsUrlBaseBarbers + wsDeleteAppointment + wsExt,
            data:   (
                        //"barber_id=" + $data.barber_id + 
                        "mobile_user_id="   + $data.mobile_user_id + 
                        "&appointment_id="  + $data.appointment_id +
                        "&enviadopor="      + $data.enviadopor + 
                        "&observaciones="   + encodeURIComponent($data.observaciones) + 
                        "&nothing="
                    ),
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            timeout: 30000   
        });
    };
    
    var cancelInfoAppointment = function($data) {
       
        return $http({
            method: 'POST',
            url: wsUrlBaseBarbers + wsCancelAppointment + wsExt,
            data:   (
                        "mobile_user_id="   + $data.mobile_user_id + 
                        "&appointment_id="  + $data.appointment_id + 
                        "&observaciones="   + encodeURIComponent($data.observaciones) +
                        "&nothing="
                    ),
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            timeout: 30000   
        });
    };
    
    return {
        searchTimeAvailable: searchInfoTimeAvailable,
        saveBarberAppointment: saveBarberAppointmentInfo,
        deleteAppointment: deleteInfoAppointment,
        //confirmAppointment: confirmInfoAppointment,
        cancelAppointment: cancelInfoAppointment,
        getAppointmentList: getInfoAppointmentList,
        getAppointmentDetail: getInfoAppointmentDetail
    };
 })
 

.factory('Services', function($http, $rootScope, $stateParams) {
    var getInfoBarbersServices = function($params) {
        return $http({
            method: 'POST',
            url: wsUrlBaseBarbers + wsBarberServices + wsExt,
            data: 'barber_id=' + $params.barber_id,
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            timeout: 30000   
        });
    };    
    //obtener los servicios que puedo agregar, es decir, del listado total los que no tiene agregados el barbero
    var getInfoAvailableServices = function($params) {
        return $http({
                method: 'POST',
                url: wsUrlBaseBarbers + wsAvailableService + wsExt,
                data: 'barber_id=' + $params.barber_id,
                
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                },
            timeout: 30000                
        });
    };
    
    var getInfoAllServices = function($params) {
        return $http({
            method: 'POST',
            url: wsUrlBaseBarbers + wsServicesList + wsExt,
            data: 'barber_id=' + $params.barber_id,
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            timeout: 30000   
        });
    };
    
    var getInfoService = function($params) {

        return $http({
            method: 'POST',
            url: wsUrlBaseBarbers + wsGetService + wsExt,
            data: 'barber_id=' + $params.barber_id + '&service_id=' + $params.service_id + '&nothing=',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            timeout: 30000   
        });
    };
    return {
        getBarberServices: getInfoBarbersServices,
        getAllServices: getInfoAllServices,
        getAvailableServices: getInfoAvailableServices,
        getService: getInfoService
    };
 })
 
.factory('MobileUser', function($http, $rootScope, $stateParams) {
    var getInfoMobileUser = function($params) {
        return $http({
            method: 'POST',
            url: wsUrlBaseBarbers + wsMobileUserView + wsExt,
            data: 'mobile_user_id=' + $params.muser_id,
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            timeout: 30000   
        });
    };
    
    var editMobileUserInfo = function($data) {
        return $http({
            method: 'POST',
            url: wsUrlBaseBarbers + wsMobileUserEdit + wsExt,
            data:   "mobile_user_id="   + $data.mobile_user_id + 
                    "&enviadopor="      + $data.enviadopor + 
                    "&email="           + $data.email + 
                    "&nombre="          + $data.name + 
                    "&telefono="        + $data.phone + 
                    "&tokenpush="       + $data.tokenpush +
                    "&password="        + $data.password + 
                    "&sexo="            + $data.gender +
                    "&fechanacimiento=" + $data.birthdate +
                    "&codigobarbero="   + encodeURIComponent($data.codigobarbero) +
                    "&foto="            + $data.foto + 
                    "&extensionfoto="   + $data.extensionfoto + 
                    "&locale="          + $data.locale +
                    "&observaciones="   + encodeURIComponent($data.observations) +
                    "&nothing=''",
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            timeout: 40000   
        });
    };
    
    var addMobileUserInfo = function($data) {
        
        return $http({
            method: 'POST',
            url: wsUrlBaseBarbers + wsMobileUserRegister + wsExt,
            data:   "enviadopor="      + $data.enviadopor + 
                    "&email="        + $data.email + 
                    "&nombre="      + $data.name + 
                    "&telefono="    + $data.phone + 
                    "&password="    + $data.password + 
                    "&sexo="        + $data.gender +
                    "&fechanacimiento=" + $data.birthdate +
                    "&codigobarbero="   + encodeURIComponent($data.codigobarbero) +
                    "&extensionfoto="   + $data.extensionfoto + 
                    "&foto="            + $data.foto + 
                    "&observaciones="   + encodeURIComponent($data.observations) +
                    "&locale="          + $data.locale +
                    "&nothing=",
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            timeout: 30000   
        });
    };
    
    var updateBarberId  = function($data) {       
        return $http({
            method: 'POST',
            url: wsUrlBaseBarbers + wsMobileUserUpdateBarber + wsExt,
            data:   "mobile_user_id=" + $data.mobile_user_id +
                    "&barber_id=" + $data.barber_id + 
                    "&nothing=''",
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            timeout: 30000   
        });
    };
    
    var requestInfoRememberPassword = function($params) {
        
        return $http({
            method: 'POST',
            url: wsUrlBaseBarbers + wsBarberRememberPassword + wsExt,
            data: ( 'email='        + $params.email + 
                    '&enviadopor='  + $params.enviadopor +
                    '&nothing='
                ),
            headers: {
                //'Content-Type': 'application/x-www-form-urlencoded'
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            timeout: 30000//30s   
        });
    };
    
    return {
        getMobileUser: getInfoMobileUser,
        editMobileUser: editMobileUserInfo,
        addMobileUser: addMobileUserInfo, 
        updateBarberId: updateBarberId,
        requestRememberPassword: requestInfoRememberPassword
    };
 })


.factory('Barbers', function($http, $rootScope, $stateParams) {
    
    var getInfoBarber = function($params) {
        
        return $http({
            method: 'POST',
            url: wsUrlBaseBarbers + wsBarberDetail + wsExt,
            data: 'mobile_user_id=' + $params.mobile_user_id +
                  '&barber_id=' + $params.barber_id +'&nothing=',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            timeout: 30000   
        });
    };
    
    var getInfoSearchBarbers = function($params) {
        return $http({
            method: 'POST',
            url: wsUrlBaseBarbers + wsBarberSearch + wsExt,
            data: (
                    'mobile_user_id='   + $params.mobile_user_id +
                    '&latitud='         + $params.latitud +
                    '&longitud='        + $params.longitud +
                    '&radio='           + $params.radio +
                    '&criterio='        + $params.criterio +
                    '&nothing='
                   ),
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            timeout: 30000   
        });
    };
    
    return {
        getBarber: getInfoBarber,
        getSearchBarbers: getInfoSearchBarbers
    };
 })
 
.factory('Posts', function($http, $rootScope, $stateParams) {
    
    var getListPosts = function($params) {
        
        return $http({
            method: 'POST',
            url: wsUrlBaseBarbers + wsPostsList + wsExt,
            data: 'locale=' + $params.locale +
                  '&barber_id=' + $params.barber_id + 
                  '&type_content=' + $params.type_content + 
                  '&criterio=' + $params.criterio +
                  '&nothing=',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            timeout: 30000   
        });
    };
    
    var setLikePosts = function($params) {
        
        return $http({
            method: 'POST',
            url: wsUrlBaseBarbers + wsPostsLike + wsExt,
            data: 'post_id=' + $params.post_id  +
                   '&likes=' + $params.likes +'&nothing=',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            timeout: 30000   
        });
    };
    
    
    return {
        getPosts: getListPosts,
        setLike: setLikePosts,
    };
 });

