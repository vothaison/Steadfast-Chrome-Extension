/*
        Set due date = sprint date when add new item
    */

V.modules.create({
    name: 'setDueDateBySprint',
    optionName: 'setDueDateBySprint',
    urlRegexes: [V.Gemini.UrlRegexes.GeminiPage],
    runNow: true,
    context: {
        
    },
    execute: function (option) {
        $('.add-item').click(function (e) {
            V.lib.poll(
                function () {
                    return $('div#FixedInVersion_chosen').length;
                },
                function () {
                    setTimeout(function () {
                        $('#FixedInVersion_chosen .chosen-results').on('click', '.active-result', function () {
                            var selected = $('select#FixedInVersion').find(":selected").text();
                            if (selected !== "None") {
                                var formated = moment(selected.trim(), "YYYY-MM-DD").format('MM/DD/YYYY');
                                $('input#DueDate').val(formated);
                            } else {
                                $('input#DueDate').val('');
                            }
                        });
                    }, 500);
                },
                function () {
                    console.warn("Poll failed for 'div#FixedInVersion_chosen'");
                });
        });
    }
});




(function () {
    /*
        Set due date = sprint date for all item in sprint
    */
    function setDueDateBySprintDate() {

        var r = window.confirm("Are you sure?!");
        if (r === true) {

        } else {
            return;
        }

        var tableData = V.$(V.Selector.WorkspaceTableData),
            ths = tableData.find('th'),
            columns = ths.length,
            dueDateColumnIndex = 0;

        ths.each(function (index, item) {
            var $item = $(item);
            if ($item.text().trim() === 'Due Date') {
                dueDateColumnIndex = index;
                return false;
            }
        });

        var anchors = tableData.find('td:nth-child({0}n - {1})'.format(columns, columns - 2)),
            anchor,
            dueDates = tableData.find('td:nth-child({0}n - 0)'.format(dueDateColumnIndex + 1)),
            dueDate,
            href = document.location.href.substring(0, document.location.href.length - 1),
            queryString = '\/grid?issueid=',
            target = href + queryString,
            i = 0,
            length = anchors.length,
            id,
            saveUrl = 'https://intranet.steadfasthub.com/AQGemini/workspace/140/inline/save?viewtype=1'
        ;
        for (; i < length; i++) {
            anchor = $(anchors[i]);
            dueDate = $(dueDates[i]);
            id = anchor.text().trim().substring(4, 9)

            $.ajax({
                method: "GET",
                url: target + id,
                data: {},
                context: { id: id, dueDate: dueDate }
            })
            .done(function (data) {
                var sprint = $(data).find('#FixedInVersion').text().trim(),
                    dueDate = this.dueDate
                ;
                //console.log("dueDate (sprint): " + sprint);

                var request = {
                    DueDate: sprint,
                    id: 'DueDate',
                    itemid: this.id,
                    property: 'DueDate'
                }

                $.ajax({
                    method: "POST",
                    url: saveUrl,
                    data: request,
                    context: { dueDate: dueDate, sprint: sprint }
                }).done(function (data) {
                    this.dueDate.text(this.sprint)
                });
            });
        }

    }

    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
          if (request.command === "set-due-date") {
              setDueDateBySprintDate();
          }

      });
}());

