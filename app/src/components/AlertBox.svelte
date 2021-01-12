<script lang="ts">
    let _msg: string = '';
    let _color: string = '';
    let _display: string = 'none';
    let _timer: number;
    
    export function info(msg: string) {
        show(msg, '#93C993');
    }
    export function err(msg: string) {
        show(msg, '#ff6666');
    }

    function show(msg: string, color: string) {
        if (_timer) {
            clearTimeout(_timer);
            hide();
        }
        _msg = msg;
        _color = color;
        _display = 'block';
        _timer = setTimeout(hide, 2000);
    }
    function hide() {
        _msg = '';
        _color = '';
        _display = 'none';
        _timer = null;
    }
</script>

<style>
    .box {
        background-color: #343434;
        position: fixed;
        bottom: 0;
        right: 0;
    }
    .text {
        padding: 0.25rem;
        margin: 0;
    }
</style>

<div class="monaco-editor box" style="display: {_display};">
    <p class="text" style="color: {_color};">{_msg}</p>
</div>