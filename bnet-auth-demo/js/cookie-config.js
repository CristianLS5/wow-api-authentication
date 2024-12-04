window.addEventListener('load', function() {
    CookieConsent.run({
        categories: {
            necessary: {
                enabled: true,  // this category is enabled by default
                readOnly: true  // this category cannot be disabled
            },
            analytics: {},
            session: {
                enabled: true,
                readOnly: true
            }
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
                        showPreferencesBtn: 'Manage preferences'
                    },
                    preferencesModal: {
                        title: 'Cookie Preferences',
                        acceptAllBtn: 'Accept all',
                        acceptNecessaryBtn: 'Accept necessary only',
                        savePreferencesBtn: 'Save preferences',
                        closeIconLabel: 'Close modal',
                        sections: [
                            {
                                title: 'Cookie Usage',
                                description: 'We use cookies to manage your Battle.net authentication session and provide basic functionality.'
                            },
                            {
                                title: 'Strictly Necessary Cookies',
                                description: 'These cookies are essential for the proper functioning of the authentication system and cannot be disabled.',
                                linkedCategory: 'necessary'
                            },
                            {
                                title: 'Session Cookies',
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
}); 