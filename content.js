/*
 * MindTouch Chrome Extension
 * Copyright (C) 2006-2013 MindTouch, Inc.
 * www.mindtouch.com
 *
 * For community documentation and downloads visit help.mindtouch.com;
 * please review the licensing section.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

$(document).ready(function() {
    var statsKey = null;
    var reload = function() {
        chrome.devtools.inspectedWindow.eval(
            "Deki.Stats",
            function(result, isException) {
                if(isException || !result) {
                    $('#mt-api-stats').hide();
                    $('#mt-error').find('*').remove();
                    $('#mt-error').append('<h2 id="mt-chrome-ext-error">Waiting for statistics</h2>');
                    $('#mt-error').show();
                    statsKey = null;
                } else {
                    if(statsKey === btoa(result)) {
                        return;
                    }
                    statsKey = btoa(result);
                    $('#mt-api-stats').show();
                    $('#mt-error').hide();
                    $('#mt-stats-table').find('tr:gt(0)').remove();
                    $('#mt-stats-total').find('*').remove();
                    var content = '';
                    chrome.devtools.inspectedWindow.eval(
                        "Deki.BaseHref",
                        function(href, isException) {
                            _.each(result.stats.requests, function(request) {
                                content += '<tr>' +
                                    '<td class="col1">' + request.verb + '</td>' +
                                    '<td class="col2">' + request.time + '</td>' +
                                    '<td class="col3"><div class="stat-col"><a target="_blank" href="' + href + request.urlPath + '">' + request.urlPath.substring(0, 80) + '</a></div>';
                                request.stats.split(';').forEach(function(item) {
                                    content += '<div class="stat-col">' + item + '</div>';
                                });
                                content += '</td></tr>';
                            });
                        $('#mt-stats-table').append(content);
                        }
                    );
                    $('#mt-stats-total').append('<span>' + result.stats.total + '</span>');
                }
            });
    };
    setInterval(reload, 500);
});
