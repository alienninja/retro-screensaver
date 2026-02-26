// apps/about.js — About Program Manager dialog

function openAbout31() {
    createAppWindow('About Program Manager', 340, 230, `
        <div class="about-body">
            <div class="about-flag">🪟</div>
            <div class="about-text">
                <strong>Microsoft Windows</strong><br>
                Version 3.1<br>
                Copyright © 1985-1992 Microsoft Corp.<br><br>
                <em>Just kidding — this is retro.bithash.cc</em><br><br>
                <small>386 Enhanced Mode<br>
                Memory: 8,192 KB Free<br>
                System Resources: 74% Free</small>
            </div>
        </div>
        <div class="dlg-footer">
            <button class="btn31" onclick="this.closest('.app-win').remove()">OK</button>
        </div>
    `, { noResize: true });
}
