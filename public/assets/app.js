// GRAB ARTICLES AS JSON
$.getJSON("/articles", data => {
    // For each one
    for (let i = 0; i < data.length; i++) {
        $('#articles').append(`<p data-id=${data[i]._id}> <a href='${data[i].link}' target='_blank'>${data[i].title}</p>`);
    }
});

$('#logo').on('click', () => {
    axios.get('/scrape')
        .then(data => {
            console.log(data);
            
        })
        .catch(err => {
            console.log(err);
        })

        window.location.href = '/';
})

$(document).on("click", "p", () => {
    $("#notes").empty();
    const thisId = $(this).attr("data-id");

    axios.get(`/articles/${thisId}`)
        .then(data => {
            console.log(data);
            $("#notes").append(`<h2>${data.title}</h2>`);
            $("#notes").append(`<input id='titleinput' name='title'>`);
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#notes").append(`<button data-id='${data._id}' id='savenote'>Save Note</button>`);

            if (data.note) {
                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            }
        })
});

// SAVE NOTE
$(document).on("click", "#savenote", () => {
    const thisId = $(this).attr("data-id");

    axios.post(`/articles/${thisId}`, {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
    })
        .then(data => {
            console.log(data);
            $("#notes").empty();
        });

    $("#titleinput").val("");
    $("#bodyinput").val("");

});
