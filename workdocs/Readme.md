#include "./workdocs/1-Header.md"
#include "./workdocs/2-Badges.md"

#include "./workdocs/4-Description.md"

#include "./workdocs/5-HowToUse.md"

#include "./workdocs/6-Related.md"

#include "./workdocs/7-Social.md"

#include "./workdocs/99-Footer.md"


git config --global url."https://api:$(cat .token)@github.com/".insteadOf "https://github.com/" && git config --global url."https://ssh:$(cat .token)@github.com/".insteadOf "ssh://git@github.com/" && git config --global url."https://git:$(cat .token)@github.com/".insteadOf "git@github.com:"