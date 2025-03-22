// first get users

async function getUsers() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await response.json();
    return users;
}

// get albums based on user id - https://jsonplaceholder.typicode.com/albums

async function getAlbums(userId) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/albums?userId=${userId}`);
    const albums = await response.json();
    return albums;
}

// get photos based on album id - https://jsonplaceholder.typicode.com/photos

async function getPhotos(albumId) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`);
    const photos = await response.json();
    return photos;
}

// first load users, then we display placehodler thumbnail for each user, 
// then we load a ranom picture from random album of selected user


async function getRandomAlbumFromUser(userId) {
    const albums = await getAlbums(userId);
    const randomAlbum = albums[Math.floor(Math.random() * albums.length)];
    return randomAlbum;
}

async function getRandomPhotoFromAlbum(albumId) {
    const photos = await getPhotos(albumId);
    const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
    return randomPhoto;
}

async function displayUsers() {
    const users = await getUsers();
    const gallery = document.getElementById('gallery');
    
    const userPromises = users.map(async user => {
        const thumbnail = document.createElement('div');
        let randomAlbum = await getRandomAlbumFromUser(user.id);    
        let randomPhoto = await getRandomPhotoFromAlbum(randomAlbum.id);
        
        thumbnail.classList.add('thumbnail');
        thumbnail.innerHTML = `
            <img src="${randomPhoto.thumbnailUrl}" alt="User ${user.name}">
            <div class="user-info">
                <h2>${user.name}</h2>
                <p><strong>Username:</strong> ${user.username}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Address:</strong> ${user.address.street}, ${user.address.suite}, ${user.address.city} ${user.address.zipcode}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p><strong>Website:</strong> <a href="http://${user.website}" target="_blank">${user.website}</a></p>
                <div class="company-info">
                    <h3>Company</h3>
                    <p><strong>Name:</strong> ${user.company.name}</p>
                    <p><strong>Catch Phrase:</strong> ${user.company.catchPhrase}</p>
                    <p><strong>BS:</strong> ${user.company.bs}</p>
                </div>
            </div>`;
        gallery.appendChild(thumbnail);
    });
    
    await Promise.all(userPromises);
}

displayUsers();