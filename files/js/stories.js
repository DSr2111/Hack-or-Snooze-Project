"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // if a user is logged in, show favorite/not-favorite star
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        <div>
        ${showDeleteBtn ? addDeleteHTML() : ""}
        ${showStar ? addStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <div class="story-author">by ${story.author}</div>
        <div class="story-user">posted by ${story.username}</div>
        </div>
      </li>
    `);
}

// adding delete button

function addDeleteHTML() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

//Favorite star for stories
function addStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

$allStoriesList.on("click", ".star", );

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//function to delete a story

async function deleteStory(e) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  await putUserStoriesOnPage();
}

$ownStories.on("click", ".trash-can", deleteStory);

//adding function that is called when users submit a story

async function submitStory(e) {
  console.debug("submitNewStory");
  e.preventDefault();

  const title = $(".new-story-title").val;
  const author = $(".new-story-author").val;
  const url = $(".new-story-url").val;
  const username = currentUser.username;

  const newStory = await storyList.addStory(currentUser, {
    title,
    author,
    url,
    username,
  });

  const $story = generateStoryMarkup(newStory);
  $allStoriesList.prepend($story);
  $("#new-story-form").trigger("reset");
  $("new-story-form").on("submit", submitStory);
}

//function to delete stories

async function deleteStory(e) {
  e.preventDefault();
  const target = e.currentTarget;
  const storyId = target.closest("li").id;

  await Story.deleteStory(storyId);
  target.closest("li").remove;
}

//add async for favorite 
