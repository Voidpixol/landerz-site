
const select = (element, type = "") => {
  if(type === "all") return document.querySelectorAll(element)
  return document.querySelector(element)
}

const postsUrl = "https://jsonplaceholder.typicode.com/posts"
const usersUrl = "https://randomuser.me/api/0.8/?results=4"

//Mobile Navigation
let menuOpen = false;

//Testimonials
let testimonials = {}
let currentTestimonial;
const transitionTimer = 10;
let transition;

function toCamelCase(word) {
  return word.split('').reduce((previus, current, index) => {
    if(index == 0) return previus += current.toUpperCase()
    return previus += current;
  }, '')
}
function processUserData(data)
{
  return [...data.results].map((item) => ({
    name: `${toCamelCase(item.user.name.title)} ${toCamelCase(item.user.name.first)} ${toCamelCase(item.user.name.last)}`,
    img: item.user.picture.large,
  }));
}

async function getData(url) {
  let data = await fetch(url)
  .then(res => res.json())
  .catch(err => err)
  return data
}

async function initTestimonials(){
  let users = await getData(usersUrl)
  let posts = await getData(postsUrl)
  users = processUserData(users)
  
  if(Object.keys(posts).length === 0 || Object.keys(users).length === 0) {
    console.error('ERROR FETCHING DATA')
    return;
  }
  
  testimonials = {users, posts}
 
  setTestimonial(1)

  let controls = ['#control-1', '#control-2', '#control-3', '#control-4']
  controls = controls.map(id => select(id))
  controls.forEach((element, index) => {
    element.addEventListener("click", () => setTestimonial(index + 1));
  })
}

const setTestimonial = (n) => {
  if(n == currentTestimonial) return
  clearTimeout(transition)

  let avatar = select('#testimonial-avatar')
  let text = select('#testimonial-text')
  let name = select('#testimonial-name')
  let button = select(`#control-${n}`)
  let container = select(`#testimonial-container`)

  button.classList.remove('bg-gray-100')
  button.classList.add('bg-green')
  
  let preloadImage = new Image()
  preloadImage.src = testimonials.users[n - 1].img
  
  if(currentTestimonial != undefined){
    let prev = select(`#control-${currentTestimonial}`)
    prev.classList.remove('bg-green')
    prev.classList.add('bg-gray-100')
    container.classList.remove('fade-in')
    container.classList.add('fade-out')
    setTimeout(() => {
      avatar.src = testimonials.users[n - 1].img
      name.innerHTML = testimonials.users[n - 1].name
      text.innerHTML = testimonials.posts[n - 1].body
      container.classList.remove('fade-out')
      container.classList.add('fade-in')
    }, 980)
  }
  else{
    avatar.src = testimonials.users[n - 1].img
    name.innerHTML = testimonials.users[n - 1].name
    text.innerHTML = testimonials.posts[n - 1].body
  }
  currentTestimonial = n;
  let next = n >= 4 ? 1 : n + 1 
  transition = setTimeout(() => setTestimonial(next), transitionTimer * 1000)
}
function show(event, element, show)
{
  event.preventDefault()
  if(show){
    element.classList.remove('hide')
  }
  else element.classList.add('hide')
}
function toggleMenu(event)
{
  const mobileMenu = select('.mobile-menu');
  menuOpen = !menuOpen;
  show(event, mobileMenu, menuOpen)
}
function initButtons() {
  const modal = select('.modal');
  const submitButton = select('#submit');
  const closeButton = select('#modal-close');
  const hamburger = select('#hamburger');
  const mobileLinks = select('.mobile-link', 'all');

  mobileLinks.forEach(item => item.addEventListener("click", event => toggleMenu(event)))
  hamburger.addEventListener("click", event => toggleMenu(event))
  submitButton.addEventListener("click", event => show(event, modal, true));
  closeButton.addEventListener("click", event => show(event, modal, false));
}
initTestimonials()
initButtons()