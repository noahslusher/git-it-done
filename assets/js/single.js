var issueContainerEl = document.getElementById('issues-container')
var limitWarningEl = document.getElementById('limit-warning')
var repoNameEl = document.getElementById('repo-name')

var getRepoName = function() {
 // get repo name from url query string
 var queryString = document.location.search;
 // get second part of query string (After '=')
 var repoName = queryString.split("=")[1]
 // only display content if repoName is valid
 if (repoName) {
  repoNameEl.textContent = repoName
  getRepoIssues(repoName)
 }
 // go back to homepage if reponame is not valid
 else {
  document.location.replace("./index.html")
 }
}


var getRepoIssues = function(repo) {
 
 //console.log(repo)
 var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

 fetch(apiUrl).then(function(response) {
  // request was successful
  if (response.ok) {
   response.json().then(function(data) {
    displayIssues(data)

    // check is api has paginated issues
    if (response.headers.get("Link")) {
     
     displayWarning(repo)
    }
   })
  }
  else {
   document.location.replace("./index.html")
  }
 })
 
 
 }




var displayIssues = function(issues) {
// Check to see if there are any active issues
if (issues.length === 0) {
 issueContainerEl.textContent = "This repo has no open issues!"
 return;
}
 for (var i = 0; i < issues.length; i++) {
  // create a link element to take users to the issue on github
  var issueEl = document.createElement("a")
  // setting "a" element classes and link to issues html_url with target="_blank"
  issueEl.classList = "list-item flex-row justify-space-between align-center";
  issueEl.setAttribute("href", issues[i].html_url);
  issueEl.setAttribute("target", "_blank");
  // append issueEl to page
 issueContainerEl.appendChild(issueEl);
 
  // create span to hold issue title
  var titleEl = document.createElement("span");
  titleEl.textContent = issues[i].title;

  //append to the container
  issueEl.appendChild(titleEl);

  //create a type element
  var typeEl = document.createElement("span");
 
  // check if ussue is an actual issue or a pull request
  if (issues[i].pull_request) {
   typeEl.textContent = "(Pull Request)";
  }
  else {
   typeEl.textContent = "(Issue)";
  }

  // append to the container
  issueEl.appendChild(typeEl);
 }
}

var displayWarning = function(repo) {
 // add text to warning container
 limitWarningEl.textContent = "To see more than 30 issues, visit "
 var linkEl = document.createElement("a")
 linkEl.textContent = "See more issues on GitHub.com";
 linkEl.setAttribute("href", "https://github.com/" + repo + "/issues")
 linkEl.setAttribute("target", "_blank")

 // append to warning container
limitWarningEl.appendChild(linkEl)
}

getRepoName()