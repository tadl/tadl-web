all:
	rsync --exclude .*.swp -avP /home/wjr/work/tadlmobile-web/*.html /home/wjr/work/tadlmobile-web/img /home/wjr/work/tadlmobile-web/css /home/wjr/work/tadlmobile-web/js /var/www/m/

production:
	rsync --exclude .*.swp -avP /home/wjr/work/tadlmobile-web/*.html /home/wjr/work/tadlmobile-web/img /home/wjr/work/tadlmobile-web/css /home/wjr/work/tadlmobile-web/js root@castor.tadl.org:/var/www/www.tadl.org/m/

targets:
	echo "all: Copies relevant web files to localhost:/var/www/m (default)"; echo "production: Copies relevant web files to castor:/var/www/www.tadl.org/m/"
