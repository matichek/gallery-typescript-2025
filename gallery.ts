// Define interfaces for our data structures
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

interface Album {
  userId: number;
  id: number;
  title: string;
}

interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

// first get users
async function getUsers(): Promise<User[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const users: User[] = await response.json();
  return users;
}

// get albums based on user id
async function getAlbums(userId: number): Promise<Album[]> {
  const response = await fetch(`https://jsonplaceholder.typicode.com/albums?userId=${userId}`);
  const albums: Album[] = await response.json();
  return albums;
}

// get photos based on album id
async function getPhotos(albumId: number): Promise<Photo[]> {
  const response = await fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`);
  const photos: Photo[] = await response.json();
  return photos;
}

async function getRandomAlbumFromUser(userId: number): Promise<Album> {
  const albums = await getAlbums(userId);
  const randomAlbum = albums[Math.floor(Math.random() * albums.length)];
  return randomAlbum;
}

async function getRandomPhotoFromAlbum(albumId: number): Promise<Photo> {
  const photos = await getPhotos(albumId);
  const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
  return randomPhoto;
}

async function displayUsers(): Promise<void> {
  const users = await getUsers();
  const gallery = document.getElementById('gallery');
  
  if (!gallery) {
    console.error('Gallery element not found');
    return;
  }
  
  const userPromises = users.map(async (user: User) => {
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

// Start the application
displayUsers(); 