
var storage = firebase.storage();
var storageRef = storage.ref();
var expanded = false;

function uploadImageSize() {
    var div = document.querySelector(".upload-image")
    div.classList.toggle("shortened")
}

function toggleDiv() {
    var div = document.querySelector('.expanded');
    if (!expanded) {
        // Expand the div
        div.classList.add('show');
        expanded = true;
    } else {
        // Collapse the div
        div.classList.remove('show');
        expanded = false;
    }
}
function uploadImage() {
    var file = document.getElementById('imageInput').files[0];
    var uploadTask = storageRef.child('images/' + file.name).put(file);
    uploadTask.on('state_changed', function(snapshot) {
        // show upload progress if needed
    }, function(error) {
        // handle upload error if needed
    }, function() {
        // handle successful upload
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            // update image src attribute with download URL
            document.getElementById('uploadedImage').src = downloadURL;
        });
    });
}