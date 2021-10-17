
const select = (element) => {
  return document.querySelector(element)
}

const postsUrl = "https://jsonplaceholder.typicode.com/posts"
const usersUrl = "https://jsonplaceholder.typicode.com/users"

let testimonials = {}
let currentTestimonial;
let transition;

const imgUrl = (n) => `/assets/images/person_${n}.jpg`
async function getData(url) {
  let data = await fetch(url)
  .then(res => res.json())
  .catch(err => {
    console.log(err)
    return undefined
  })
  return data
}

async function init(){
  let users = await getData(usersUrl)
  let posts = await getData(postsUrl)
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
  console.log(n, transition)
  clearTimeout(transition)
  
  let avatar = select('#testimonial-avatar')
  let text = select('#testimonial-text')
  let name = select('#testimonial-name')
  let button = select(`#control-${n}`)
  let container = select(`#testimonial-container`)

  button.classList.remove('bg-gray-100')
  button.classList.add('bg-green')
  
  if(currentTestimonial != undefined){
    let prev = select(`#control-${currentTestimonial}`)
    prev.classList.remove('bg-green')
    prev.classList.add('bg-gray-100')
    container.classList.remove('fade-in')
    container.classList.add('fade-out')
    setTimeout(() => {
      avatar.src = imgUrl(n)
      name.innerHTML = testimonials.users[n].name
      text.innerHTML = testimonials.posts[n].body
      container.classList.remove('fade-out')
      container.classList.add('fade-in')
    }, 950)
  }
  else{
    avatar.src = imgUrl(n)
    name.innerHTML = testimonials.users[n].name
    text.innerHTML = testimonials.posts[n].body
  }
  currentTestimonial = n;
  let next = n >= 4 ? 1 : n + 1 
  transition = setTimeout(() => setTestimonial(next), 5000)
}
init()
