/*
 * MindTouch Core - open source enterprise collaborative networking
 *  derived from MediaWiki (www.mediawiki.org)
 * Copyright (c) 2006-2010 MindTouch Inc.
 * www.mindtouch.com oss@mindtouch.com
 *
 * For community documentation and downloads visit www.opengarden.org;
 * please review the licensing section.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 * http://www.gnu.org/copyleft/gpl.html
 */

$(document).ready(function() {
    var reload = function() {
        chrome.devtools.inspectedWindow.eval(
            "Deki.Stats",
            function(result, isException) {
                if(isException || !result) {
                    $('#mt-stats-table').hide();
                    $('#mt-stats-total').hide();
                    $('#mt-chrome-ext-error').remove();
                    $('.mindtouch-api-stats').append('<h2 id="mt-chrome-ext-error">Waiting for statistics</h2>');
                } else {
                    $('#mt-stats-table').show();
                    $('#mt-stats-total').show();
                    $('#mt-chrome-ext-error').remove();
                    $('#mt-stats-table').find('tr:gt(0)').remove();
                    $('#mt-stats-total').find('*').remove();
                    var content = '';
                    _.each(result.stats.requests, function(request) {
                        content += '<tr>' +
                            '<td>' + request.verb + '</td>' +
                            '<td>' + request.time + '</td>' +
                            '<td><a target="_blank" href="' + request.urlPath + '">' + request.urlPath.substring(0, 80) + '</a>';
                        request.stats.split(';').forEach(function(item) {
                            content += '<br />' + item;
                        });
                        content += '</td></tr>';
                    });
                    $('#mt-stats-table').append(content);
                    $('#mt-stats-total').append('<p>' + result.stats.total + '</p>');
                }
            });
    };
    setInterval(reload, 500);
});
