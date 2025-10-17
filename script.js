/*
 * JavaScript Boilerplate for News Aggregator Project
 * 
 * This JavaScript file is part of the Web APIs assignment.
 * Your task is to complete the functions with appropriate module pattern, observer pattern, singleton pattern.
 * 
 * Follow the TODO prompts and complete each section to ensure the
 * News Aggregator App works as expected.
 */

// Singleton Pattern: ConfigManager
const ConfigManager = (function() {
    let instance;

    function createInstance() {
        return {
            theme: 'dark',
            apiUrl: 'https://newsapi.org/v2/top-headlines',
            apiKey: '7f3a50f7fa26460e919ca0f2f875ea9d',
        };
    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    }

})();

// Module Pattern: NewsFetcher
const NewsFetcher = (function () {
    const config = ConfigManager.getInstance();
    
    function fetchArticles() {
        return fetch(`${config.apiUrl}?country=us&apiKey=${config.apiKey}`)
            .then(response => response.json())
            .then(data => data.articles)
            .catch(error => console.error('Error fetching articles:', error));
    }

    return {
        getArticles: fetchArticles
    };
})();

// Observer Pattern: NewsFeed
function NewsFeed() {
    this.observers = [];
    this.articles = [];
}


NewsFeed.prototype = {
    subscribe: function(observer) {
        this.observers.push(observer);
    },

    unsubscribe: function(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    },

    notify: function(article) {
        this.observers.forEach(observer => observer(article));
    },

    addArticle: function(article) {
        this.articles.push(article);
        this.notify(article);
    }
};



// Instantiate the NewsFeed
const newsFeed = new NewsFeed();

// Observer 1: Update Headline
function updateHeadline(article) {
    const headlineElement = document.getElementById('headline').querySelector('p');
    headlineElement.textContent = article.title;
}

// Observer 2: Update Article List
function updateArticleList(article) {
    const articleListElement = document.getElementById('articles');
    const listItem = document.createElement('li');
    listItem.textContent = article.title;
    articleListElement.appendChild(listItem);
}

// TODO: Subscribe Observers
newsFeed.subscribe(updateHeadline);
newsFeed.subscribe(updateArticleList);

// Fetch and display articles
NewsFetcher.getArticles().then(articles => {
    articles.forEach(article => {
        newsFeed.addArticle(article);
    });
});

// Display Config Info
const configInfo = ConfigManager.getInstance();
document.getElementById('configInfo').textContent = `Theme: ${configInfo.theme}`;

