let cl = console.log;

const addModal = document.getElementById('addModal');
const movieModal = document.getElementById('movieModal');
const backdrop = document.getElementById('backdrop');
const movieForm = document.getElementById('movieForm');
const closeModal = [...document.getElementsByClassName('closeModal')]
const title = document.getElementById('title')
const imageUrl = document.getElementById('imageUrl')
const overview = document.getElementById('overview')
const rating = document.getElementById('rating')
const movieContainer = document.getElementById('movieContainer');
const updatebtn = document.getElementById('updatebtn')
const submitbtn = document.getElementById('submitbtn')
const loader = document.getElementById('loader');
// const myList = document.getElementById('myList')
const myListclick = document.getElementById('myListclick')

const baseUrl = `https://movie-modal-project-default-rtdb.asia-southeast1.firebasedatabase.app`
const movieUrl = `${baseUrl}/Movie-modal.json`
// cl(movieUrl)

const snackBarMsg = (msg, icon, timer) => {
    swal.fire({
        title: msg,
        icon: icon,
        timer: timer
    })
} 

const loaderToggle = () => {
    loader.classList.toggle('d-none')
}

const makeApiCall = (apiUrl, methodName, msgBody=null) =>{
    msgBody = msgBody ? JSON.stringify(msgBody) : null
    return fetch(apiUrl, {
        method : methodName,
        body : msgBody        
    }).then(res => res.json())
}

const objToArr = (obj)=>{
    let movieArr = [];
    for(let key in obj){
    movieArr.push({...obj[key], id:key});
    }
    return movieArr    
}

const onTemplating = (arr) => {
    let card = `` ;
    arr.forEach(movie => {
        card += `
        <div class="col-md-4 mt-4">
        <div class="card mb-4">
          <figure class="movieCard" id="${movie.id}">
             <img src="${movie.imageUrl}" alt="${movie.title}" title="${movie.title}">
             <figcaption>
                 <div class="ratingSection">
                     <div class="row">
                         <div class="col-md-9">
                            <h3>${movie.title}</h3> 
                         </div>
                         <div class="col-md-3">
                            <div class="rating">
                             ${movie.rating > 4 ? `<span class="bg-success"> ${movie.rating} </span>` :
                             movie.rating >= 2 && movie.rating <= 4 ?`<span class="bg-warning">
                             ${movie.rating}</span>` : `<span class="bg-danger">${movie.rating}</span>`}
                           </div>  
                         </div>
                     </div>
                 </div>
                 <div class="overViewSection">
                     <h4>${movie.title}</h4>
                     <em>OVERVIEW</em>
                     <p>${movie.overview}</p>
                     <span>
                    <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                     </span>
                     <span class="text-right">
                     <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                      </span>
                 </div>
             </figcaption>
          </figure>
        </div>
     </div>
              `
    })
    movieContainer.innerHTML = card;
}

loaderToggle()
makeApiCall(movieUrl , 'GET' , null)
  .then(data => {
      cl(data)
      let postArr = objToArr(data)
      onTemplating(postArr.reverse())
  })
  .catch(cl)
  .finally(() => {
    loaderToggle()
  })

const addUpdateBtn = () => {
    submitbtn.classList.toggle('d-none')
    updatebtn.classList.toggle('d-none')
}  

const onEdit = (ele) => {
    let editId = ele.closest('.movieCard').id
    localStorage.setItem('editId', editId)
    cl(editId)
    let editUrl = `${baseUrl}/Movie-modal/${editId}.json`
    makeApiCall(editUrl,'GET')
      .then(res => {
        title.value = res.title;
        imageUrl.value = res.imageUrl;
        overview.value = res.overview;
        rating.value = res.rating;
        onshowhideModal()
        addUpdateBtn()
      })
}  

const onDelete = (ele) => {
    let deleteId = ele.closest('.movieCard').id
    cl(deleteId)
    let deleteUrl = `${baseUrl}/Movie-modal/${deleteId}.json`
    loaderToggle()
    makeApiCall(deleteUrl,'DELETE', )
      .then(res => {
        // document.getElementById(deleteId).remove()
        ele.closest('.card').remove()
        loaderToggle()
        snackBarMsg(`Movie deleted successfully !!!`, 'success' , 1500) 
      })
}

const createMoiveCard = (obj) => {
    let card = document.createElement('div');
    card.id = obj.id;
    card.className = "col-md-4 mt-4";
    card.innerHTML = `
    <div class="card mb-4">
    <figure class="movieCard" id="${obj.id}">
       <img src="${obj.imageUrl}" alt="${obj.title}" title="${obj.title}">
       <figcaption>
           <div class="ratingSection">
               <div class="row">
                   <div class="col-md-9">
                      <h3>${obj.title}</h3> 
                   </div>
                   <div class="col-md-3">
                   <div class="rating">
                   ${obj.rating > 4 ? `<span class="bg-success"> ${obj.rating} </span>` :
                   obj.rating >= 2 && obj.rating <= 4 ?`<span class="bg-warning">
                   ${obj.rating}</span>` : `<span class="bg-danger">${obj.rating}</span>`}
                 </div>  
                   </div>
               </div>
           </div>
           <div class="overViewSection">
               <h4>${obj.title}</h4>
               <em>OVERVIEW</em>
               <p>${obj.overview}</p>
               <span>
               <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                </span>
                <span class="text-right">
                <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                 </span>
           </div>
       </figcaption>
    </figure>
  </div>
                  `
  movieContainer.prepend(card);                
}

const onMovieAddHandler = (e) => {
     e.preventDefault()
     let movieObj = {
        title : title.value,
        imageUrl : imageUrl.value,
        overview : overview.value,
        rating : rating.value

     }
     cl(movieObj)
     loaderToggle()
     makeApiCall(movieUrl , 'POST' , movieObj)
      .then(res => {
        movieObj.id = res.name;
        createMoiveCard(movieObj)
        snackBarMsg(`Movie added to collection successfully !!!` ,'success' , 1500)
    })
    .catch(err => snackBarMsg(`error`,'error',1500))
    .finally(() => {
        loaderToggle()
        movieForm.reset()
        onshowhideModal()
    })
}


const onshowhideModal = () => {
    backdrop.classList.toggle('active');
     movieModal.classList.toggle('active');
}

const updatedCard = (obj) => {
    let card = [...document.getElementById(obj.id).children]
    cl(card)
    card[0].innerHTML = `<figure class="movieCard" id="${obj.id}">
       <img src="${obj.imageUrl}" alt="${obj.title}" title="${obj.title}">`
       
     card[1].innerHTML   =   `<div class="ratingSection">
               <div class="row">
                   <div class="col-md-9">
                      <h3>${obj.title}</h3> 
                   </div>
                   <div class="col-md-3">
                   <div class="rating">
                   ${obj.rating > 4 ? `<span class="bg-success"> ${obj.rating} </span>` :
                   obj.rating >= 2 && obj.rating <= 4 ?`<span class="bg-warning">
                   ${obj.rating}</span>` : `<span class="bg-danger">${obj.rating}</span>`}
                 </div>  
                   </div>
               </div>
           </div>
           <div class="overViewSection">
               <h4>${obj.title}</h4>
               <em>OVERVIEW</em>
               <p>${obj.overview}</p>
               <span>
               <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                </span>
                <span class="text-right">
                <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                 </span>
           </div>`
      
}

const onMovieupdate = () => {
    let updateId = localStorage.getItem('editId');
    let updateUrl = `${baseUrl}/Movie-modal/${updateId}.json`
    let updatedObj = {
        title : title.value,
        imageUrl : imageUrl.value,
        overview : overview.value,
        rating : rating.value,
        id : updateId
    }
    cl(updatedObj)
    loaderToggle()
    makeApiCall(updateUrl , 'PATCH' , updatedObj)
      .then(res => {
        cl(res)
        // let card = [...document.getElementById(updateId).children]
        // cl(card)
        updatedCard(updatedObj)
        loaderToggle()
        snackBarMsg(`Movie from your collection updated successfully !!!`, 'success',1500)
      }).catch(err => snackBarMsg('err' , 'error',1500))
      .finally(() => {
        movieForm.reset()
        onshowhideModal()
      })
}

const onListscroll = () => {
    document.getElementById('myList').scrollIntoView()
}

movieForm.addEventListener("submit", onMovieAddHandler);
addModal.addEventListener('click', onshowhideModal);
updatebtn.addEventListener('click' , onMovieupdate)
closeModal.forEach(hideall => 
hideall.addEventListener('click' , onshowhideModal) );
myListclick.addEventListener('click' , onListscroll)