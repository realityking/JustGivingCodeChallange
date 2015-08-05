(function() {
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
        }).then(function(response) {
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
            return html`<div class="pledge-container">
    <label for="pledge-input" class="sr-only">Pledge amount</label>
    <input type="text" placeholder="£20" class="pledge-input" id="pledge-input" /> <button type="button" id="pledge-button" class="btn btn-pledge">Pledge</button>
</div>`;
        }
        if (state === 'success') {
            return html`<div class="pledge-container">
    <div class="pledge-msg">Thanks for your pledge!</div>
</div>`;
        }
        if (state === 'error') {
            return html`<div class="pledge-container">
    <div class="pledge-msg">There was an error, please try again later.</div>
</div>`;
        }
    }

    function createHtml(data) {
        var totalPledged = currencyFormatter.format(data.totalPledged);
        var target = currencyFormatter.format(data.target);
        var rawPercent = data.totalPledged / data.target;
        var pledgePercentage = percentFormatter.format(rawPercent);
        var cssPercent = Math.round(rawPercent * 100);

        var header = html`<img src="/images/${data.mainImage}" width="498" height="280" alt="" />
    <p class="story-text">${data.story}</p>
    <div class="meter">
        <div class="bar" style="width: ${cssPercent}%;"></div>
    </div>
    <p class="meter-info meter-info-left"><span class="big">${totalPledged}</span> pledged of <strong>${target}</strong> funding target</p>
    <p class="meter-info meter-info-right"><strong class="big">${pledgePercentage}</strong> funded</p>
    <div class="clearfix"></div>`;

        var main = createMainHtml(data.state);

        var footer = html`<div class="project-owner-container clearfix">
        <div class="project-owner-wrapper">
            <img src="/images/${data.ownerAvatar}" height="50" width="50" alt="" class="avatar" />
            <p class="owner-name"><span class="text-light owner-title">Project owner</span>${data.owner}</p>
        </div>
    </div>
    <div class="footer">
        <p class="footer-text">Create your own crowdfunding project and make a difference in your community</p>
        <a class="btn btn-started" href="https://home.justgiving.com" target="_blank">Get started</a>
        <p class="text-light">Powered by</p>
        <img src="/images/justgiving_logo.svg" alt="JustGiving™" width="210" />
    </div>`;

        return '<div class="container">' + header + main + footer + '</div>'
    }

    var pagePromise = fetch('/api/crowdFundingPage ')
        .then(function decodeJson(response) {
            return response.json();
        });
    document.addEventListener("DOMContentLoaded", function() {
        pagePromise.then(function pageSuccess(data){
            data.state = 'pledge';
            var container = document.getElementById('pledge-placeholder');
            container.innerHTML = createHtml(data);

            var pledgeInput = document.getElementById('pledge-input');
            var pledgeButton = document.getElementById('pledge-button');
            function onPledge() {
                submitPledge(pledgeInput.value)
                    .then(function pledgeSuccess(response) {
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
}());

