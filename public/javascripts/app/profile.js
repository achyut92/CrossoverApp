
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var target = $(e.target).attr("href") 
    if (target === '#profile') {
        $(".profile").load("/users/profile-edit");
    }
    if (target === '#orders') {
        $(".profile").load("/users/orders");
    }
    
});
