'use strict';

var _templateObject = _taggedTemplateLiteral(['<div class="pledge-container">\n    <label for="pledge-input" class="sr-only">Pledge amount</label>\n    <input type="text" placeholder="£20" class="pledge-input" id="pledge-input" /> <button type="button" id="pledge-button" class="btn btn-pledge">Pledge</button>\n</div>'], ['<div class="pledge-container">\n    <label for="pledge-input" class="sr-only">Pledge amount</label>\n    <input type="text" placeholder="£20" class="pledge-input" id="pledge-input" /> <button type="button" id="pledge-button" class="btn btn-pledge">Pledge</button>\n</div>']),
    _templateObject2 = _taggedTemplateLiteral(['<div class="pledge-container">\n    <div class="pledge-msg">Thanks for your pledge!</div>\n</div>'], ['<div class="pledge-container">\n    <div class="pledge-msg">Thanks for your pledge!</div>\n</div>']),
    _templateObject3 = _taggedTemplateLiteral(['<div class="pledge-container">\n    <div class="pledge-msg">There was an error, please try again later.</div>\n</div>'], ['<div class="pledge-container">\n    <div class="pledge-msg">There was an error, please try again later.</div>\n</div>']),
    _templateObject4 = _taggedTemplateLiteral(['<img src="/images/', '" width="498" height="280" alt="" />\n    <p class="story-text">', '</p>\n    <div class="meter">\n        <div class="bar" style="width: ', '%;"></div>\n    </div>\n    <p class="meter-info meter-info-left"><span class="big">', '</span> pledged of <strong>', '</strong> funding target</p>\n    <p class="meter-info meter-info-right"><strong class="big">', '</strong> funded</p>\n    <div class="clearfix"></div>'], ['<img src="/images/', '" width="498" height="280" alt="" />\n    <p class="story-text">', '</p>\n    <div class="meter">\n        <div class="bar" style="width: ', '%;"></div>\n    </div>\n    <p class="meter-info meter-info-left"><span class="big">', '</span> pledged of <strong>', '</strong> funding target</p>\n    <p class="meter-info meter-info-right"><strong class="big">', '</strong> funded</p>\n    <div class="clearfix"></div>']),
    _templateObject5 = _taggedTemplateLiteral(['<div class="project-owner-container clearfix">\n        <div class="project-owner-wrapper">\n            <img src="/images/', '" height="50" width="50" alt="" class="avatar" />\n            <p class="owner-name"><span class="text-light owner-title">Project owner</span>', '</p>\n        </div>\n    </div>\n    <div class="footer">\n        <p class="footer-text">Create your own crowdfunding project and make a difference in your community</p>\n        <a class="btn btn-started" href="https://home.justgiving.com" target="_blank">Get started</a>\n        <p class="text-light">Powered by</p>\n        <img src="/images/justgiving_logo.svg" alt="JustGiving™" width="210" />\n    </div>'], ['<div class="project-owner-container clearfix">\n        <div class="project-owner-wrapper">\n            <img src="/images/', '" height="50" width="50" alt="" class="avatar" />\n            <p class="owner-name"><span class="text-light owner-title">Project owner</span>', '</p>\n        </div>\n    </div>\n    <div class="footer">\n        <p class="footer-text">Create your own crowdfunding project and make a difference in your community</p>\n        <a class="btn btn-started" href="https://home.justgiving.com" target="_blank">Get started</a>\n        <p class="text-light">Powered by</p>\n        <img src="/images/justgiving_logo.svg" alt="JustGiving™" width="210" />\n    </div>']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

(function () {
    // HTML Escape helper utility
    // Thanks to Andrea Giammarchi
    function replaceHtmlSpecialChar(m) {
        var oEscape = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        };
        return oEscape[m];
    }

    function escapeHtml(s) {
        return s.toString().replace(/[&<>'"]/g, replaceHtmlSpecialChar);
    }

    // Tagged template function
    function html(pieces) {
        var result = pieces[0];
        var substitutions = [].slice.call(arguments, 1);
        for (var i = 0; i < substitutions.length; ++i) {
            result += escapeHtml(substitutions[i]) + pieces[i + 1];
        }

        return result;
    }

    function submitPledge(amount) {
        return fetch('/api/pledge/' + amount, {
            method: 'POST'
        }).then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            }

            return Promise.reject(response.status);
        });
    }

    var currencyFormatter = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP'
    });
    var percentFormatter = new Intl.NumberFormat('en-GB', {
        style: 'percent',
        maximumFractionDigits: 0
    });

    function createMainHtml(state) {
        if (state === 'pledge') {
            return html(_templateObject);
        }
        if (state === 'success') {
            return html(_templateObject2);
        }
        if (state === 'error') {
            return html(_templateObject3);
        }
    }

    function createHtml(data) {
        var totalPledged = currencyFormatter.format(data.totalPledged);
        var target = currencyFormatter.format(data.target);
        var rawPercent = data.totalPledged / data.target;
        var pledgePercentage = percentFormatter.format(rawPercent);
        var cssPercent = Math.round(rawPercent * 100);

        var header = html(_templateObject4, data.mainImage, data.story, cssPercent, totalPledged, target, pledgePercentage);

        var main = createMainHtml(data.state);

        var footer = html(_templateObject5, data.ownerAvatar, data.owner);

        return '<div class="container">' + header + main + footer + '</div>';
    }

    var pagePromise = fetch('/api/crowdFundingPage ').then(function decodeJson(response) {
        return response.json();
    });
    document.addEventListener("DOMContentLoaded", function () {
        pagePromise.then(function pageSuccess(data) {
            data.state = 'pledge';
            var container = document.getElementById('pledge-placeholder');
            container.innerHTML = createHtml(data);

            var pledgeInput = document.getElementById('pledge-input');
            var pledgeButton = document.getElementById('pledge-button');
            function onPledge() {
                submitPledge(pledgeInput.value).then(function pledgeSuccess(response) {
                    data.state = 'success';
                    data.totalPledged = response.totalPledged;
                    pledgeButton.removeEventListener('click', onPledge);
                    container.innerHTML = createHtml(data);
                }, function pledgeError() {
                    data.state = 'error';
                    pledgeButton.removeEventListener('click', onPledge);
                    container.innerHTML = createHtml(data);
                });
            }

            pledgeButton.addEventListener('click', onPledge);
        }, function pageError(reason) {
            // Ups, can't load data
        });
    });
})();
