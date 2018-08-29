var TimeTable = function () {
    var url = "http://localhost:8080/timetable";

    var startPageLoading = function() {
        $('.page-loading').remove();
        $('body').append('<div class="page-loading"><img src="assets/images/loading-spinner-blue.gif"/>&nbsp;&nbsp;<span> Loading... </span></div>');
    }

    var stopPageLoading = function() {
        $('.page-loading').remove();
    }

    var handleTimeTable = function() {
        var pageContent = $('.page-content .page-content-body'); 
        startPageLoading();

        $.ajax({
            type: "POST",
            cache: false,
            url: url,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {    
                stopPageLoading();
                if(response.success) {                    
                    populateData(pageContent, response.data);                    
                }
            },
            error: function (response, ajaxOptions, thrownError) {
                stopPageLoading();
                pageContent.html('<h4>Could not load the requested content.</h4>');                
            }
        });
    }

    var populateData = function(pageContent, data) {
        var template = document.querySelector('#schedule-template');
        
        pageContent.html('');
        pageContent.append('<div class="row">');

        var i = 0;
        data.timeTable.forEach(timetable => {
            i++;
            template.content.querySelector('#scheduled-day').innerHTML = timetable.shiftDay;
            template.content.querySelector('#scheduled-date').innerHTML = timetable.shiftDate;

            var j = 0;
            timetable.engineers.forEach(engineer => {
                j++;

                if(j % 2) {
                    template.content.querySelector('#shift_1 .status-title').innerHTML = "Day Shift:";
                    template.content.querySelector('#shift_1 .status-name').innerHTML = engineer.name;
                } else {
                    template.content.querySelector('#shift_2 .status-title').innerHTML = "Night Shift:";
                    template.content.querySelector('#shift_2 .status-name').innerHTML = engineer.name;
                }                                
            });

            var content = document.importNode(template.content, true);
            pageContent.append(content);

            if(i === 5) {
                pageContent.append('</div>');
                pageContent.append('<div class="row">');
            }
        });
        pageContent.append('</div>');     
    }

    return {
        //main function to initiate the module
        init: function () {
            handleTimeTable();
        }
    };

}();

jQuery(document).ready(function() {
    TimeTable.init();
});