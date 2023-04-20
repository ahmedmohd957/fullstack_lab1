// Fetch all albums
async function getAlbums() {
    try {
        const resonse = await fetch("/albums");
        return await resonse.json();
    } catch (error) {
        console.error("Error fetching albums:", error);
    }
}

// Fetch album by title
async function getAlbum(title) {
    try {
        const response = await fetch(`/albums/${title}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching album:", error);
    }
}

// Delete album
async function deleteAlbum(albumId) {
    try {
        const response = await fetch(`/albums/${albumId}`, {
            method: 'DELETE',
        });
        return response;
    } catch (error) {
        console.error("Error fetching album:", error);
    }
}

// Handle onclick delete button
async function handleDeleteBtn(albumId, tableRow) {
    if (window.confirm("Are you sure you want to delete this item?")) {
        await deleteAlbum(albumId).then((response) => {
            if (response.ok) {
                tableRow.remove();
            } else {
                throw new Error('Album not deleted');
            }
        });
    }
}

// Display albums
async function displayAlbums(albums) {
    const tableList = document.getElementById('album-list');
    // Loops through the albums and creates a table row for each one
    albums.forEach(album => {
        const tableRow = document.createElement("tr");
        tableRow.className = 'album-table-row';
        tableRow.innerHTML = `
            <td>${album.title}</td>
            <td>${album.artist}</td>
            <td>${album.year}</td>
            <td><button class="btn btn-secondary btn-sm update-btn">Update</button></td>
            <td><button class="btn btn-danger btn-sm delete-btn">Delete</button></td>
            <td><button class="btn btn-dark btn-sm show-details-btn">Show details</button></td>

        `;
        // Update button
        tableRow.querySelector('.update-btn').addEventListener('click', () => {
            window.location.href = `/update/${album.title}`;
        });
        // Delete button
        tableRow.querySelector('.delete-btn').addEventListener('click', () => {
            handleDeleteBtn(album._id, tableRow);
        });
        // Show details button
        tableRow.querySelector('.show-details-btn').addEventListener('click', () => {
            window.location.href = `/album/${album.title}`;
        });
        tableList.appendChild(tableRow);
    });
    const createAlbumBtn = document.getElementById('create-album-btn');
    createAlbumBtn.addEventListener('click', () => {
        window.location.href = '/create';
    });
}

// Update page
function displayUpdateAlbum(album) {
    const titleInput = document.querySelector('input[name="title"]');
    const artistInput = document.querySelector('input[name="artist"]');
    const yearInput = document.querySelector('input[name="year"]');
    titleInput.value = album.title;
    artistInput.value = album.artist;
    yearInput.value = album.year;

    document.querySelector('.form').addEventListener('submit', (event) => {
        handleUpdateAlbum(event, album._id);
    });
}

// Album details page
function displayAlbumDetails(album) {
    const albumDetailsHeading = document.querySelector('.album-details-heading');
    albumDetailsHeading.textContent = `Album: ${album.title}`;
    const albumList = document.getElementById('album-list-group');
    albumList.innerHTML = `
        <li class="list-group-item">Title: ${album.title}</li>
        <li class="list-group-item">Artist: ${album.artist}</li>
        <li class="list-group-item">Year: ${album.year}</li>
    `;
}

// Handle update form submit btn
function handleUpdateAlbum(event, albumId) {
    event.preventDefault();
    
    const updatedAlbum = {
        title: event.target.title.value,
        artist: event.target.artist.value,
        year: event.target.year.value
    };
    
    fetch(`http://localhost:3000/albums/${albumId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedAlbum)
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/';
        } else {
            throw new Error('Album not updated');
        }
    })
    .catch(error => {
        console.error(error);
    });
}

// Handle pages
async function handlePages() {
    if (window.location.pathname === '/') {
        await getAlbums().then(data => {
            displayAlbums(data);
        });
    } else if (window.location.pathname.startsWith('/album/')) {
        const title = window.location.pathname.split('/').pop();
        await getAlbum(title).then(data => {
            displayAlbumDetails(data[0]);
        });
    } else if (window.location.pathname.startsWith('/update/')) {
        const title = window.location.pathname.split('/').pop();
        await getAlbum(title).then(data => {
            displayUpdateAlbum(data[0]);
        });
    }
}

handlePages();