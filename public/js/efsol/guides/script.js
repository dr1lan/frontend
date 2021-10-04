const guidePageUrl = window.location.href.substr(24)
const guideLinks = document.querySelectorAll('.guides-sidebar__link');

function setLinkActiveClass() {
	guideLinks.forEach(link => {
		if (guidePageUrl === link.getAttribute('href') || window.location.href.substr(20) === link.getAttribute('href')) {
			link.classList.add('active');
		}
	})
};

setLinkActiveClass();
