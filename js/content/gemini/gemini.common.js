V.augment({
    Gemini: {
        UrlRegexes: {
            ItemDetailsPage: /https:\/\/.*\/workspace\/\d+\/item\/\d+.*/i,
            GeminiPage: /https:\/\/intranet\.steadfasthub\.com.*/i,
            Dashboard: /https:\/\/intranet\.steadfasthub\.com.*\/dashboard/i,

        }
    }
});
