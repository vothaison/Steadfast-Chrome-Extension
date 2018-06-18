/**
 * This will show a list of people who work on current project.
 * We can assign task by click on the person in this list
 * 
 * */

V.modules.create({
    name: 'showQuickAssign',
    optionName: 'showQuickAssign',
    urlRegexes: [V.Gemini.UrlRegexes.ItemDetailsPage],
    runNow: true,

    context: {
        suggestionPeople: [],

        assignPersonById: function (personId, callback) {
            var ticketNumber = V.lib.gemini.getTicketNumber();
            if (!ticketNumber) return;

            $.ajax({
                type: 'POST',
                url: V.Const.GeminiSaveUrl,
                context: document.body,
                data: {
                    AssignedTo: personId,
                    id: 'AssignedTo',
                    itemid: parseInt(ticketNumber),
                    property: 'AssignedTo'
                }
            }).done(function (data) {
                callback(data);
            });
        },

        assignPersonByName: function (personName, callback) {
            var found = V.Extension.People.filter(function (item) {
                if (item.geminiName && personName) {
                    return item.geminiName.allTrim() === personName.allTrim();
                }
            }).pop();

            var personId = found && found.geminiId;
            this.assignPersonById(personId, function () {
                console.log("Assigned to: ", personName, personId);
                callback();
            });
        },

        getListOfFollowers: function () {
            var list = [];

            V.$(V.Selector.WatcherTableRows).each(function () {
                var tr = $(this);
                list.push(tr.find('td').first().text().trim())
            });

            list.shift();
            return list;

        },

        getListOfCommentors: function () {
            var authorBoxes = V.$(V.Selector.AuthorBox);
            var list = [];

            authorBoxes.each(function () {
                var authorBox = $(this)
                list.push(authorBox.find('.author').text().trim());
            });

            return list.distinct();
        },

        getListOfSuggestions: function () {
            var commentors = this.getListOfCommentors();
            var followers = this.getListOfFollowers();
            var currentPerson = V.$(V.Selector.OpenProfile).text().allTrim();
            var i;
            var list = [currentPerson];

            for (i = commentors.length - 1; i >= 0; i--) {
                if (commentors[i] && commentors[i].allTrim() === currentPerson.allTrim()) {
                    commentors.splice(i, 1);
                    break;       //<-- Uncomment  if only the first term has to be removed
                }
            }

            for (i = followers.length - 1; i >= 0; i--) {
                if (followers[i] && followers[i].allTrim() === currentPerson.allTrim()) {
                    followers.splice(i, 1);
                    break;       //<-- Uncomment  if only the first term has to be removed
                }
            }

            list = list.concat(followers).distinct();
            return list;
        },

        waitUntilResourceIs: function (name, callback) {
            var currentPerson = V.$(V.Selector.AssignedToSpan).text().trim();

            if (currentPerson && name
                && currentPerson.allTrim() === name.allTrim()) {
                callback.call();
            } else {
                setTimeout(function () {
                    waitUntilResourceIs(name, callback);
                }, 500);
            }
        },

        initSuggestionList: function (attributesRoot, list, currentPerson) {
            var self = this;

            V.$(V.Selector.LeftZone).find('.gx-fake-attributes-wrapper').remove();

            var fakeAttributePane = $('<div class="fake-attributes-pane fake-item-pane gx-fake-attributes-wrapper">').prependTo(V.Selector.LeftZone);
            var fakeAttributePaneWrapper = $('<div id="gx-fake-attributes-wrapper">').appendTo(fakeAttributePane);
            var resizable = $('<div class="gx-accordion-resizer" class="ui-widget-content">').appendTo(fakeAttributePaneWrapper);
            var accordion = $('<div class="gx-accordion">').appendTo(resizable);
            var yesSpanHtml = '<span class="gx-answer gx-yes">Yes</span>';
            var noSpanHtml = '<span class="gx-answer gx-no">No</span>';
            var startHeight = 0;
            var liHeight = 25;
            var initialHeight = startHeight + list.length * liHeight + liHeight * 1.5;
            var expandedHeight = startHeight + V.Extension.People.length * liHeight + liHeight * 2;

            currentPerson = currentPerson || V.$(V.Selector.AssignedToSpan).text().trim();

            var firstDiv = $('<div class="gx-fake-title" style="float: none">');
            firstDiv.text('Assign To');
            firstDiv.prependTo(fakeAttributePane);

            var simplifiedList = V.Extension.People.map(function (item) {
                return item.geminiName && item.geminiName.replace(/ +(?= )/g, '');
            });
            var listOfOtherPeople = simplifiedList.filter(function (x) { return list.indexOf(x) < 0 });

            listOfOtherPeople = listOfOtherPeople.sort(function (a, b) {
                if (a < b) return -1;
                if (a > b) return 1;
                return 0;
            });
            listOfOtherPeople = listOfOtherPeople.filter(function (item) {
                return item;
            });

            var concat = list.concat(listOfOtherPeople).filter(function (item) { return item && item.trim().length });

            var validCount = 0;

            $('.gx-accordion-resizer').css('height', initialHeight);
            var expand = $('<a class="gx-expand-link" href="javascript:void(0)" title="Click to expand">&nbsp;</a>');
            expand.appendTo(fakeAttributePane);

            expand.click(function () {
                var element = $(this);
                var resizer = $('.gx-accordion-resizer');

                if (resizer.prop('expanded')) {
                    resizer.css('height', initialHeight).prop('expanded', false);
                    element.removeClass('gx-expand-link--collapse').attr('title', 'Click to expand');
                } else {
                    resizer.css('height', expandedHeight).prop('expanded', true);
                    element.addClass('gx-expand-link--collapse').attr('title', 'Click to collapse');


                    //V.lib.poll(
                    //  function () {
                    //      return $("select#AssignedTo").length;
                    //  },
                    //  function () {
                    //      console.log('It appears');

                    //      $('.inline-edit-dropdown .fonticon-tick').click(function () {
                    //          V.lib.poll(
                    //            function () {
                    //                return !$("select#AssignedTo").length;
                    //            },
                    //            function () {
                    //                console.log('IT\'S gone');
                    //                self.initSuggestionList(V.$(V.Selector.AttributeContainer), getListOfSuggestions());
                    //            },
                    //            function () {
                    //                console.log('IT\'S NOT gone');
                    //            }
                    //        );
                    //      });

                    //  },
                    //  function () {
                    //      console.log('It... NO');
                    //  },
                    //  30000, 3000);
                }
            });

            concat.forEach(function (item) {
                if (!item) return;
                validCount++;


                var h3 = $('<h3 class="gx-item">').text(item).appendTo(accordion);
                var div = $('<div class="gx-accordion-content">').appendTo(accordion);
                var yes = $(yesSpanHtml).attr('gx-person-name', item);
                var no = $(noSpanHtml);

                if (item.allTrim() !== currentPerson.allTrim()) {
                    div.append(yes).append(no).css('background-color', 'red');
                    h3.addClass("gx-accordion-toggle");
                } else {
                    h3.addClass('gx-selected');
                }
            });

            $('.gx-answer').click(function () {
                var answer = $(this);
                if (answer.is('.gx-yes')) {

                    answer.text('Ajax going..');

                    self.assignPersonByName(answer.attr('gx-person-name'), function () {
                        answer.text('Done');
                        answer.closest('.gx-accordion-content').slideUp('fast', function () {
                            answer.text('Yes');
                        });
                        self.initSuggestionList(fakeAttributePane, list, answer.attr('gx-person-name'));
                        $('[data-attribute-id="AssignedTo"]').next().find('#AssignedTo').text(answer.attr('gx-person-name'));
                    });
                } else {
                    answer.closest('.gx-accordion-content').slideUp('fast');
                }


            });

            $('.gx-accordion').find('.gx-accordion-toggle').click(function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                //Expand or collapse this panel
                $(this).next().slideToggle('fast');

                //Hide the other panels
                $(".gx-accordion-content").not($(this).next()).slideUp('fast');

            });

        },

        listenToAssigneeChanged: function () {
            var self = this;

            $('body').on('click', '.attribute', function (e) {
                console.log('click on attribute;');
                if (!$(e.currentTarget).find('#AssignedTo').length) return;
                console.log('click on AssignedTo;');

                V.lib.poll(
                  function () {
                      return $("select#AssignedTo").length;
                  },
                  function () {
                      console.log('It appears');

                      $('.inline-edit-dropdown .fonticon-tick').click(function () {
                          V.lib.poll(
                            function () {
                                return !$("select#AssignedTo").length;
                            },
                            function () {
                                console.log('IT\'S gone');
                                self.initSuggestionList(V.$(V.Selector.AttributeContainer), getListOfSuggestions());
                            },
                            function () {
                                console.log('IT\'S NOT gone');
                            }
                        );
                      });

                  },
                  function () {
                      console.log('It... NO');
                  }
                  );
            });
        },

        getPeople: function (callback, context) {
            var self = this;
            $.ajax({
                type: 'POST',
                url: 'https://intranet.steadfasthub.com/AQGemini/workspace/0/inline/get?viewtype=11',
                context: document.body,
                data: {
                    0: '{',
                    1: '}',
                    id: 12694,
                    property: 'AssignedTo',
                }
            }).done(function (data) {
                self.setupPeopleList(data);
                callback.call(context || this);
            });
        },

        setupPeopleList: function (data) {
            var html = data;
            var people = [];

            html = html.replace('name="AssignedTo"', '').replace('id="AssignedTo"', '');
            $('head').append(html);
            var select = $('head>select');
            var input = $('head>input');
            input.remove();
            select.remove();

            select.find('option').each(function () {
                var option = $(this);
                if (option.attr('value')) {
                    people.push({
                        "geminiId": option.attr('value'),
                        "geminiName": option.text().trim().replace(/ +(?= )/g, '')
                    });
                }
            });

            V.Extension.People = people;
        },

        init: function () {
            var list = this.getListOfSuggestions();
            this.suggestionPeople = list;

            this.initSuggestionList(V.$(V.Selector.AttributeContainer), list);
            this.listenToAssigneeChanged();

            return list;
        }

    },
    execute: function (option) {
        console.log("Execute suggestPeopleToAssign");
        V.lib.loadCssFile("chrome-extension://" + chrome.runtime.id + "/css/content/gemini/gemini.assignee-list.css");
        this.getPeople(this.init, this);
    }
});