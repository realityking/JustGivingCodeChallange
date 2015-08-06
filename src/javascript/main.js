(function() {
    // HTML Escape helper utility
    // Thanks to Andrea Giammarchi
    function replaceHtmlSpecialChar(m) {
        const oEscape = {
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
    function html(pieces, ...substitutions) {
        let result = pieces[0];
        for (let i = 0; i < substitutions.length; ++i) {
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

    const currencyFormatter = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP'
    });
    const percentFormatter = new Intl.NumberFormat('en-GB', {
        style: 'percent',
        maximumFractionDigits: 0
    });

    function createMainHtml(state) {
        if (state === 'pledge') {
            return html`<form class="pledge-container" id="pledge-form">
    <label for="pledge-input" class="sr-only">Pledge amount</label>
    <input type="text" placeholder="£20" class="pledge-input" id="pledge-input" required="required" /> <button class="btn btn-pledge">Pledge</button>
</form>`;
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
        const totalPledged = currencyFormatter.format(data.totalPledged);
        const target = currencyFormatter.format(data.target);
        const rawPercent = data.totalPledged / data.target;
        const pledgePercentage = percentFormatter.format(rawPercent);
        const cssPercent = Math.round(rawPercent * 100);

        const header = html`<img src="/images/${data.mainImage}" width="498" height="280" alt="" />
    <p class="story-text">${data.story}</p>
    <div class="meter">
        <div class="bar" style="width: ${cssPercent}%;"></div>
    </div>
    <p class="meter-info meter-info-left"><span class="big">${totalPledged}</span> pledged of <strong>${target}</strong> funding target</p>
    <p class="meter-info meter-info-right"><strong class="big">${pledgePercentage}</strong> funded</p>
    <div class="clearfix"></div>`;

        const main = createMainHtml(data.state);

        const footer = html`<div class="project-owner-container clearfix">
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

    const pagePromise = fetch('/api/crowdFundingPage ')
        .then(function decodeJson(response) {
            return response.json();
        });
    document.addEventListener("DOMContentLoaded", function() {
        pagePromise.then(function pageSuccess(data){
            data.state = 'pledge';
            const container = document.getElementById('pledge-placeholder');
            container.innerHTML = createHtml(data);

            let pledgeInput = document.getElementById('pledge-input');
            let pledgeForm = document.getElementById('pledge-form');

            function refreshHtml(data) {
                pledgeForm.removeEventListener('submit', onPledge);
                container.innerHTML = createHtml(data);
                pledgeInput = pledgeForm = null;
            }

            function onPledge(event) {
                event.preventDefault();
                submitPledge(pledgeInput.value)
                    .then(function pledgeSuccess(response) {
                        data.state = 'success';
                        data.totalPledged = response.totalPledged;
                        refreshHtml(data);
                    }, function pledgeError() {
                        data.state = 'error';
                        refreshHtml(data);
                    });
            }

            pledgeForm.addEventListener('submit', onPledge);
        }, function pageError(reason) {
            // Ups, can't load data, do nothing
        });
    });
}());

