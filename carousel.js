angular.module('carousel', [
    
])
.controller('MainCtrl', function(){
    
})
.directive('dirCarousel', function($timeout){
    return {
        scope: {
            carousel_name: '@dirCarousel',
            prev_active_class:'@prevActive',
            prev_inactive_class:'@prevInactive',
            next_active_class:'@nextActive',
            next_inactive_class:'@nextInactive'
        },
        restrict: 'A',
        replace: false,
        link: function(scope, elem, attrs) {
            
            $timeout(function () {
                            
                var visible_portion = elem[0].getElementsByClassName('c_screen')[0];
                var list_parent = elem[0].getElementsByClassName('c_list')[0];
                var list_elements = elem[0].getElementsByClassName('c_list_item');

                var list_elem_width = list_elements[0].offsetWidth;            

                var prev_limit = list_parent.offsetLeft;
                var visible_list_elems = ( Math.floor(visible_portion.offsetWidth/list_elem_width) === 0 ) ? Math.round(visible_portion.offsetWidth/list_elem_width) : Math.floor(visible_portion.offsetWidth/list_elem_width);
                var next_limit = list_elem_width * ( visible_list_elems - list_elements.length ) + list_parent.offsetLeft;  //visible_list_elems*list_elem_width - list_parent.offsetWidth

                var prev_arrow = elem[0].getElementsByClassName('c_prev')[0];
                var next_arrow = elem[0].getElementsByClassName('c_next')[0];

                var move_unit = 50;
                var move_timeout = 10;

                var bullet_flag = 0;

                if( elem[0].getElementsByClassName('c_bullet').length !== 0 ) {
                    bullet_flag = 1;
                }

                angular.element(prev_arrow).on('click', function(){
                    var from = list_parent.offsetLeft;
                    var to = list_parent.offsetLeft + list_elem_width;
                    rv = animateRight(list_parent, from, to, prev_limit);
                    if( rv !== false && bullet_flag === 1 ) {
                        var timeout = ( Math.ceil(list_elem_width / move_unit) * move_timeout ) + 50;
                        activateBullet(timeout);
                    }
                    else if( prev_limit <= to ) {
                        angular.element(prev_arrow).removeClass(scope.prev_active_class).addClass(scope.prev_inactive_class);
                        angular.element(next_arrow).removeClass(scope.next_inactive_class).addClass(scope.next_active_class);
                    }
                    else {
                        angular.element(prev_arrow).removeClass(scope.prev_inactive_class).addClass(scope.prev_active_class);
                        angular.element(next_arrow).removeClass(scope.next_inactive_class).addClass(scope.next_active_class);
                    }
                });

                angular.element(next_arrow).on('click', function(){
                    var from = list_parent.offsetLeft;
                    var to = list_parent.offsetLeft - list_elem_width;
                    rv = animateLeft(list_parent, from, to, next_limit);
                    if( rv !== false && bullet_flag === 1 ) {
                        var timeout = ( Math.ceil(list_elem_width / move_unit) * move_timeout ) + 50;
                        activateBullet(timeout);
                    }
                    else if( next_limit >= to ) {
                        angular.element(next_arrow).removeClass(scope.next_active_class).addClass(scope.next_inactive_class);
                        angular.element(prev_arrow).removeClass(scope.prev_inactive_class).addClass(scope.prev_active_class);
                    }
                    else {
                        angular.element(prev_arrow).removeClass(scope.prev_inactive_class).addClass(scope.prev_active_class);
                        angular.element(next_arrow).removeClass(scope.next_inactive_class).addClass(scope.next_active_class);
                    }
                });

                if( bullet_flag === 1 ) {
                    var bullets = elem[0].getElementsByClassName('c_bullet');

                    for( var i=0; i<bullets.length; i++ ) {

                        angular.element(bullets[i]).attr('c_index', i);
                        angular.element(list_elements[i]).attr('c_index', i);

                        angular.element(bullets[i]).on('click', function(){

                            var index = parseInt(angular.element(this).attr('c_index'));
                            //var rv = true;

                            if( ( list_parent.offsetLeft + index*list_elem_width ) < prev_limit ) {
                                animateRight(list_parent, list_parent.offsetLeft, prev_limit - index*list_elem_width, prev_limit);
                                //if( rv ) {
                                //    var timeout = ( Math.ceil(list_parent.offsetLeft - (prev_limit - index*list_elem_width) / move_unit) * move_timeout ) + 50;
                                //    activateBullet(timeout);
                                //}
                            }
                            else if( ( list_parent.offsetLeft + index*list_elem_width ) > prev_limit ) {
                                animateLeft(list_parent, list_parent.offsetLeft, prev_limit - index*list_elem_width, next_limit);
                                //if( rv ) {
                                //    var timeout = ( Math.ceil(list_parent.offsetLeft - (prev_limit - index*list_elem_width) / move_unit) * move_timeout ) + 50;
                                //    activateBullet(timeout);
                                //}
                            }
                            angular.element(this).parent().find('a').removeClass('active');
                            angular.element(this).find('a').addClass('active');
                        });
                    }

                    var activateBullet = function(timeout){
                        if( !timeout ) {
                            timeout = 250;
                        }

                        setTimeout(function(){
                            var index = Math.round(prev_limit - list_parent.offsetLeft / list_elem_width);
                            angular.element(bullets[index]).parent().find('a').removeClass('active');
                            angular.element(bullets[index]).find('a').addClass('active');
                        }, timeout);
                    };
                }

                var animateLeft = function (obj, from, to, limit) {
                    if(from === to){         
                        obj.style.left = from + "px";
                        return false;  
                    }
                    else if( limit >= from ){
                        return false;
                    }
                    else {
                        var box = obj;
                        var unit = ((from-to) < move_unit) ? (from-to) : move_unit;
                        box.style.left = from + "px";

                        setTimeout(function(){
                            animateLeft(obj, from - unit, to);
                        }, move_timeout);
                    }
                    return true;
                };

                var animateRight = function (obj, from, to, limit) {
                    if(from === to){         
                        obj.style.left = from + "px";
                        return false;  
                    }
                    else if( limit <= from ){
                        return false;
                    }
                    else {
                        var box = obj;
                        var unit = ((to-from) < move_unit) ? (to-from) : move_unit;
                        box.style.left = from + "px";

                        setTimeout(function(){
                            animateRight(obj, from + unit, to);
                        }, move_timeout);
                    }
                    return true;
                };
            }, 0);
        }
    };
})
;