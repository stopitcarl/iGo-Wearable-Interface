// Create image listener
$(function () {
    $('.card-img-top').click(function (e) {

        // Get current img name
        var current_src = $(this).attr('src');
        var new_src = "";

        console.log(current_src.slice(0, 14));
        // Change default image to student image        
        if (current_src.slice(0, 14) === 'assets/student')
            new_src = 'assets/alt' + current_src.slice(14, 15) + '.jpeg';
        // Change student image to default image   
        else if (current_src.slice(0, 10) === 'assets/alt')
            new_src = 'assets/student' + current_src.slice(10, 11) + '.png';

        // Animate transition
        $(this).fadeOut(250, function () {
            $(this).attr('src', new_src).bind('onreadystatechange load', function () {
                $(this).addClass('round-corners');
                if (this.complete) $(this).fadeIn(250);
            });
        });

    });
});