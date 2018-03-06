define(['durandal/app','knockout'], function (app,ko) {
    function Trip() {
        this.from = '';
        this.to = '';
        this.transportType = '';
        this.cost = 0;
        this.passengers = 0;
        this.notes = '';
    }
    function Stay() {
        this.place = '';
        this.accommodation = 0;
        this.food = 0;
        this.notes = '';
    }

    function PlanItem() {
        this.startDate = '';
        this.endDate = '';
        this.type = '';
        this.trip = new Trip();
        this.stay = new Stay();
    }

    var TRANSPORT_TYPES = ['Plane','Car','Bus','Boat','Walk','Taxi','PMT'];
    var FILE_DATA_SEPARATOR = ';';
    var model = function () {
        var self = this;
        self.style = ko.observable();
        self.title = 'Thailand 2018';

        self.planItems = ko.observableArray([]);
        self.getTransports = function() {
            self.planItems([]);
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = process;
            xhr.open("GET", "data/travels.csv", true);
            xhr.send();

            function process()
            {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var tripsRsp = xhr.responseText.split('\r\n');
                    for (var i = 0; i < tripsRsp.length; i++) {
                        var tripRsp = tripsRsp[i].split(FILE_DATA_SEPARATOR);
                        if (tripRsp.length > 1) {
                            var tripObj = new PlanItem();
                            tripObj.type = 'TRIP';
                            tripObj.startDate = new Date(tripRsp[2]);
                            tripObj.endDate = new Date(tripRsp[3]);
                            tripObj.trip.from = tripRsp[0];
                            tripObj.trip.to = tripRsp[1];
                            tripObj.trip.transportType = tripRsp[4];
                            tripObj.trip.cost = tripRsp[5];
                            tripObj.trip.passengers = tripRsp[6];
                            self.planItems().push(tripObj);
                        }
                    }
                }
            }

        };
        self.formatTransport = function(trip, index){
            return trip.trip.from + ' - ' + trip.trip.to;
        };
        self.getTransportTime = function (trip) {
            var timeDiff = "";
            if (trip.startDate != undefined) {
                timeDiff = (trip.endDate - trip.startDate) / 1000;
                timeDiff = Math.round(timeDiff / 3600 * 100) / 100;
            }
            return timeDiff + 'h';
        };

        //self.stays = ko.observableArray([]);
        self.getStays = function () {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = process;
            xhr.open("GET", "data/stays.csv", true);
            xhr.send();

            function process()
            {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var staysRsp = xhr.responseText.split('\r\n');
                    for (var i = 0; i < staysRsp.length; i++) {
                        var stayRsp = staysRsp[i].split(FILE_DATA_SEPARATOR);
                        if (stayRsp.length > 1) {
                            var stayObj = new PlanItem();
                            stayObj.type = 'STAY';
                            stayObj.stay.place = stayRsp[0];
                            stayObj.startDate = new Date(stayRsp[1]);
                            stayObj.endDate = new Date(stayRsp[2]);
                            stayObj.stay.accommodation = stayRsp[3];
                            stayObj.stay.food = stayRsp[4];
                            self.planItems.push(stayObj);
                        }
                    }
                }
            }
        };
        self.getPlanItemCSS = function (item) {
            if (item) {
                switch (item.type) {
                    case 'TRIP':
                        return 'travel';
                    case 'STAY':
                        return 'stay';
                    default:
                        return '';
                }
            }
            return '';
        };
        self.getStayTime = function (stay) {
            var timeDiff = "";
            if (stay.startDate != undefined) {
                timeDiff = (stay.endDate.getDate() - stay.startDate.getDate());
            }
            return timeDiff;
        };

        self.getPlan = function () {
            self.getTransports();
            setTimeout(function(){
                self.getStays();
            }, 50);

        };
        self.getShortDate = function (date) {
            return date.getDate() + '.' + (date.getMonth() + 1) + '.';
        };
        self.attached = function(view){
            self.getPlan();
        };
    };


    //Note: This module exports a function. That means that you, the developer, can create multiple instances.
    //This pattern is also recognized by Durandal so that it can create instances on demand.
    //If you wish to create a singleton, you should export an object instead of a function.
    //See the "flickr" module for an example of object export.

    return model;
});