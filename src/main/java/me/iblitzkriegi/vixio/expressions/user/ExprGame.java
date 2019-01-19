package me.iblitzkriegi.vixio.expressions.user;

import ch.njol.skript.classes.Changer;
import ch.njol.skript.expressions.base.SimplePropertyExpression;
import me.iblitzkriegi.vixio.Vixio;
import me.iblitzkriegi.vixio.util.Util;
import me.iblitzkriegi.vixio.util.wrapper.Bot;
import net.dv8tion.jda.core.entities.Game;
import net.dv8tion.jda.core.entities.Member;
import net.dv8tion.jda.core.entities.User;
import org.bukkit.event.Event;

public class ExprGame extends SimplePropertyExpression<Object, String> {

    static {
        Vixio.getInstance().registerPropertyExpression(ExprGame.class, String.class,
                "game", "members/users/bots/strings")
                .setName("Game of User")
                .setDesc("Get the game of a user. You may use this to set a bots game, this will set it as Playing: <whatever you input>. Use the mark as gametype effect to use the other types.")
                .setExample(
                        "discord command $info <user>:",
                        "\ttrigger:",
                        "\t\treply with \"%game of arg-1%\""
                );
    }

    private String getGame(Bot bot) {
        return bot.getJDA().getPresence().getGame() == null ? null : bot.getJDA().getPresence().getGame().getName();
    }

    @Override
    protected String getPropertyName() {
        return "game";
    }

    @Override
    public String convert(Object object) {
        if (object instanceof Member) {
            Member member = (Member) object;
            if (Util.botFromID(member.getUser().getId()) != null) {
                return getGame(Util.botFromID(member.getUser().getId()));
            }
            return member.getGame() == null ? null : member.getGame().getName();
        } else if (object instanceof User) {
            Member member = Util.getMemberFromUser(object);
            if (member == null) {
                return null;
            }
            if (Util.botFromID(member.getUser().getId()) != null) {
                return getGame(Util.botFromID(member.getUser().getId()));
            }
            return member.getGame() == null ? null : member.getGame().getName();
        } else {
            Bot bot = Util.botFrom(object);
            if (bot == null) {
                return null;
            }
            return getGame(bot);
        }
    }

    @Override
    public Class<? extends String> getReturnType() {
        return String.class;
    }

    @Override
    public Class<?>[] acceptChange(Changer.ChangeMode mode) {
        if (mode == Changer.ChangeMode.SET || mode == Changer.ChangeMode.RESET) {
            return new Class[]{String.class};
        }
        return null;
    }

    @Override
    public void change(Event e, Object[] delta, Changer.ChangeMode mode) {
        for (Object object : getExpr().getAll(e)) {
            if (Util.botFrom(object) != null) {
                Bot bot = Util.botFrom(object);
                bot.getJDA().getPresence().setGame(mode == Changer.ChangeMode.SET ? Game.of(Game.GameType.DEFAULT, (String) delta[0]) : null);
            }
        }
    }
}
