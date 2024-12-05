CookieConsent.run({
    root: 'body',
    autoShow: true,
    delay: 0,
    guiOptions: {
        consentModal: {
            layout: 'box',
            position: 'bottom right',
            equalWeightButtons: true,
            flipButtons: false
        },
        preferencesModal: {
            layout: 'box',
            position: 'right',
            equalWeightButtons: true,
            flipButtons: false
        }
    },
    categories: {
        necessary: {
            enabled: true,
            readOnly: true
        },
        analytics: {},
        session: {
            enabled: true,
            readOnly: true
        }
    },
    cookie: {
        name: 'cc_cookie',
        domain: location.hostname,
        path: '/',
        sameSite: 'Lax',
        expiresAfterDays: 365
    },
    language: {
        default: 'en',
        translations: {
            en: {
                consentModal: {
                    title: 'We use cookies',
                    description: 'This site uses cookies to enable Battle.net authentication and session management. Some cookies are essential for the proper functioning of the website.',
                    acceptAllBtn: 'Accept all',
                    acceptNecessaryBtn: 'Accept necessary only',
                    showPreferencesBtn: 'Manage preferences',
                    closeIconLabel: 'Close modal',
                    revision: 1
                },
                preferencesModal: {
                    title: 'Cookie Preferences',
                    acceptAllBtn: 'Accept all',
                    acceptNecessaryBtn: 'Accept necessary only',
                    savePreferencesBtn: 'Save preferences',
                    closeIconLabel: 'Close modal',
                    serviceCounterLabel: 'Service|Services',
                    sections: [
                        {
                            title: 'Cookie Usage',
                            description: 'We use cookies to manage your Battle.net authentication session and provide basic functionality.'
                        },
                        {
                            title: 'Strictly Necessary Cookies <span class="required">Required</span>',
                            description: 'These cookies are essential for the proper functioning of the authentication system and cannot be disabled.',
                            linkedCategory: 'necessary'
                        },
                        {
                            title: 'Session Cookies <span class="required">Required</span>',
                            description: 'These cookies are used to maintain your Battle.net authentication session.',
                            linkedCategory: 'session'
                        },
                        {
                            title: 'Analytics Cookies',
                            description: 'These cookies help us understand how visitors interact with our website.',
                            linkedCategory: 'analytics'
                        }
                    ]
                }
            }
        }
    }
}); 