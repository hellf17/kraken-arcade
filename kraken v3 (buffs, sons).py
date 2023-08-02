import random
import arcade
import math

SCREEN_WIDTH = 1280
SCREEN_HEIGHT = 720
ENEMY_TYPES = ["Type1", "Type2", "Type3"]


class GameOverView(arcade.View):
    def __init__(self, window):
        super().__init__(window=window)
        self.window = window

    def on_show(self):
        arcade.set_background_color(arcade.color.BLACK)

    def on_draw(self):
        arcade.start_render()
        arcade.draw_text("Game Over", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2,
                         arcade.color.WHITE, font_size=50, anchor_x="center")
        arcade.draw_text(f"Total XP: {self.window.player.xp}", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 50,
                         arcade.color.WHITE, font_size=20, anchor_x="center")
        arcade.draw_text(f"Total Time: {self.window.elapsed_time:.2f}", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 80,
                         arcade.color.WHITE, font_size=20, anchor_x="center")
        arcade.draw_text("Press 'R' to try again", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 110,
                         arcade.color.WHITE, font_size=20, anchor_x="center")
        arcade.draw_text("Press 'Q' to quit", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 140,
                         arcade.color.WHITE, font_size=20, anchor_x="center")

    def on_key_press(self, key, modifiers):
        if key == arcade.key.R:
            self.window.restart_game()
            self.window.show_view(self.window)
        elif key == arcade.key.Q:
            arcade.close_window()


class Buff(arcade.Sprite):
    def __init__(self, name, icon_filename, icon_scale, duration, power_modifier, speed_modifier):
        super().__init__(filename=icon_filename, scale=icon_scale)
        self.name = name
        self.icon_filename = icon_filename
        self.duration = duration
        self.power_modifier = power_modifier
        self.speed_modifier = speed_modifier

    def activate_buff(self, player, window):
        if len(player.active_buffs) < 2:
            player.active_buffs.append(self)
            player.power += self.power_modifier
            player.speed += self.speed_modifier
            arcade.schedule(lambda dt: self.deactivate_buff(player, window), self.duration)

    def deactivate_buff(self, player, window):
        if self in player.active_buffs:
            player.active_buffs.remove(self)
            player.power //= self.power_modifier
            player.speed -= self.speed_modifier

class Enemy(arcade.Sprite):
    enemy_info = {
        "Type1": {
            'image': 'enemy_1.png',
            'scale': 0.1,
            'health': 2,
            'xp_reward': 10,
            'type': 'enemy_type_1'
        },
        "Type2": {
            'image': 'enemy_2.png',
            'scale': 0.15,
            'health': 3,
            'xp_reward': 20,
            'type': 'enemy_type_2'
        },
        "Type3": {
            'image': 'enemy_3.png',
            'scale': 0.17,
            'health': 4,
            'xp_reward': 30,
            'type': 'enemy_type_3'
        }
    }

    def __init__(self, enemy_type, player):
        enemy_info = self.enemy_info.get(enemy_type)
        if enemy_info:
            super().__init__(filename=enemy_info['image'], scale=enemy_info['scale'])
            self.health = enemy_info['health']
            self.xp_reward = enemy_info['xp_reward']
            self.set_hit_box(self.texture.hit_box_points)
        else:
            super().__init__()
            self.health = 1
            self.xp_reward = 1

        self.enemy_type = enemy_type
        self.speed = 2
        self.player = player

    def update(self):
        if self.center_x < self.player.center_x:
            self.center_x += self.speed
        else:
            self.center_x -= self.speed

        if self.center_y < self.player.center_y:
            self.center_y += self.speed
        else:
            self.center_y -= self.speed

    def respawn(self):
        self.enemy_type = random.choice(ENEMY_TYPES)
        enemy_info = self.enemy_info.get(self.enemy_type)
        if enemy_info:
            self.health = enemy_info['health']
            self.xp_reward = enemy_info['xp_reward']
            self.texture = arcade.load_texture(enemy_info['image'])
            self.scale = enemy_info['scale']

        side = random.randint(1, 4)
        if side == 1:  # Cima
            self.center_x = random.uniform(0, SCREEN_WIDTH)
            self.center_y = SCREEN_HEIGHT + self.height
            self.change_x = random.uniform(-1, 1)
            self.change_y = random.uniform(-self.speed, -self.speed / 2)
        elif side == 2:  # Baixo
            self.center_x = random.uniform(0, SCREEN_WIDTH)
            self.center_y = -self.height
            self.change_x = random.uniform(-1, 1)
            self.change_y = random.uniform(self.speed / 2, self.speed)
        elif side == 3:  # Esquerda
            self.center_x = -self.width
            self.center_y = random.uniform(0, SCREEN_HEIGHT)
            self.change_x = random.uniform(self.speed / 2, self.speed)
            self.change_y = random.uniform(-1, 1)
        else:  # Direita
            self.center_x = SCREEN_WIDTH + self.width
            self.center_y = random.uniform(0, SCREEN_HEIGHT)
            self.change_x = random.uniform(-self.speed, -self.speed / 2)
            self.change_y = random.uniform(-1, 1)

def load_enemy_textures(enemy_info_list):
    enemy_sprites = []
    for enemy_type in enemy_info_list:
        enemy = Enemy(enemy_type, None)
        enemy_sprite = arcade.Sprite(filename=enemy_info_list[enemy_type]['image'],
                                     scale=enemy_info_list[enemy_type]['scale'])
        enemy.enemy_sprite = enemy_sprite
        enemy_sprites.append(enemy)
    return enemy_sprites

def load_player_texture():
    return 'kraken.png'

class Kraken(arcade.Sprite):
    def __init__(self, filename, scale, health):
        super().__init__(filename=filename, scale=scale)
        self.health = health
        self.center_x = 0
        self.center_y = 0
        self.speed = 5
        self.change_x = 0
        self.change_y = 0
        self.xp = 0
        self.power = 1
        self.active_buffs = []
        self.set_hit_box(self.texture.hit_box_points)

class KrakenGame(arcade.Window):
    def __init__(self, width, height, title):
        super().__init__(width, height, title=title)
        self.background_music = arcade.sound.load_sound("background.wav")
        arcade.sound.play_sound(self.background_music)
        self.elapsed_time = 0
        self.game_over = False
        self.game_over_view = GameOverView(self)
        self.kraken_hit_points = 5
        self.enemy_sprites = arcade.SpriteList()
        self.projectiles = arcade.SpriteList()
        self.projectile_damage = 1
        self.projectile_speed = 5
        self.buffs = arcade.SpriteList()
        self.max_buffs = 2
        self.buff_spawn_interval = random.uniform(10, 30)
        self.buff_spawn_timer = 0
        self.enemies = arcade.SpriteList()
        self.enemy_spawn_chance = {
            "enemy_type_1": 0.5,
            "enemy_type_2": 0.3,
            "enemy_type_3": 0.15
        }
        self.enemy_count = 0
        self.max_enemies = 5
        self.buff_sprite = None
        self.buff_list = [
            Buff("Black rock", "buff1.png", 0.3, 5, 3, 3),
            Buff("Blue rock", "buff2.png", 0.3, 5, 2, 2),
            Buff("Green rock", "buff3.png", 0.3, 5, 1, 1)
        ]

    def setup(self):
        self.background = arcade.load_texture("background2.png")
        self.player_textures = load_player_texture()
        self.player = Kraken(self.player_textures, 0.5, 5)
        self.player.center_x = SCREEN_WIDTH / 2
        self.player.center_y = SCREEN_HEIGHT / 2
        self.enemy_sprites = load_enemy_textures(Enemy.enemy_info)

    def spawn_enemies(self):
        if self.enemy_count < self.max_enemies:
            spawn_chance = random.random()
            cumulative_chance = 0
            for enemy_type in self.enemy_spawn_chance:
                cumulative_chance += self.enemy_spawn_chance[enemy_type]
                if spawn_chance <= cumulative_chance:
                    enemy = Enemy(enemy_type, self.player)
                    enemy.respawn()
                    self.enemies.append(enemy)
                    self.enemy_count += 1
                    break

    def spawn_buff(self, delta_time):
        self.buff_spawn_timer += delta_time

        if self.buff_spawn_timer >= self.buff_spawn_interval:
            self.buff_spawn_timer = 0

            if len(self.buffs) >= self.max_buffs:
                return

            random_buff = random.choice(self.buff_list)
            random_x = random.uniform(0, SCREEN_WIDTH)
            random_y = random.uniform(0, SCREEN_HEIGHT)
            buff = Buff(random_buff.name, random_buff.icon_filename, 0.5, random_buff.duration,
                        random_buff.power_modifier,
                        random_buff.speed_modifier)
            buff.center_x = random_x
            buff.center_y = random_y
            buff.activate_buff(self.player, self)
            self.buffs.append(buff)

    def check_buff_collision(self):
        for buff in self.buffs:
            if arcade.check_for_collision(self.player, buff):
                buff.activate_buff(self.player, self)
                print(self.projectile_damage)
                self.buffs.remove(buff)
                break

    def on_update(self, delta_time):
        if self.game_over:
            return

        self.spawn_buff(delta_time)
        self.player.update()
        self.enemies.update()
        self.spawn_enemies()
        self.check_buff_collision()
        self.projectile_damage = self.player.power

        for enemy in self.enemies:
            if arcade.check_for_collision(self.player, enemy):
                self.enemy_count -= 1
                enemy.kill()
                self.kraken_hit_points -= 1

        for projectile in self.projectiles:
            projectile.update()

            hit_enemies = arcade.check_for_collision_with_list(projectile, self.enemies)
            for enemy in hit_enemies:
                enemy.health -= self.projectile_damage
                if enemy.health <= 0:
                    self.enemy_count -= 1
                    enemy.kill()
                    self.player.xp += enemy.xp_reward
                projectile.kill()

        if self.kraken_hit_points <= 0:
            print("Game Over")
            self.game_over = True
            self.show_view(self.game_over_view)

        if not self.game_over:
            self.elapsed_time += delta_time

    def xp_tracker(self):
        if self.game_over:
            return self.player.xp

        xp = int(self.elapsed_time) * 5
        xp += self.player.xp
        return xp

    def on_draw(self):
        arcade.start_render()
        arcade.draw_texture_rectangle(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2,
                                      SCREEN_WIDTH, SCREEN_HEIGHT, self.background)
        self.player.draw()
        self.enemies.draw()
        self.projectiles.draw()
        self.buffs.draw()
        arcade.draw_text(f"Total Time: {self.elapsed_time:.2f}", 10, SCREEN_HEIGHT - 20, arcade.color.WHITE,
                         font_size=16)
        arcade.draw_text(f"Hit points: {self.kraken_hit_points:.2f}", SCREEN_WIDTH // 2, SCREEN_HEIGHT - 20,
                         arcade.color.RED, font_size=16)
        arcade.draw_text(f"XP: {self.player.xp}", SCREEN_WIDTH - 100, SCREEN_HEIGHT - 20, arcade.color.WHITE,
                         font_size=16)

        if self.game_over:
            self.set_viewport(0, SCREEN_WIDTH - 1, 0, SCREEN_HEIGHT - 1)
            self.game_over_view.on_draw()

    def on_key_press(self, key, modifiers):
        if key == arcade.key.W:
            self.player.change_y = self.player.speed
        elif key == arcade.key.S:
            self.player.change_y = -self.player.speed
        elif key == arcade.key.A:
            self.player.change_x = -self.player.speed
        elif key == arcade.key.D:
            self.player.change_x = self.player.speed

    def on_key_release(self, key, modifiers):
        if key == arcade.key.W or key == arcade.key.S:
            self.player.change_y = 0
        elif key == arcade.key.A or key == arcade.key.D:
            self.player.change_x = 0

    def on_mouse_press(self, x, y, button, modifiers):
        if button == arcade.MOUSE_BUTTON_LEFT:
            projectile = arcade.Sprite("projectile.png", 0.3)
            projectile.center_x = self.player.center_x
            projectile.center_y = self.player.center_y
            dest_x = x
            dest_y = y
            angle = math.atan2(dest_y - projectile.center_y, dest_x - projectile.center_x)
            projectile.change_x = math.cos(angle) * self.projectile_speed
            projectile.change_y = math.sin(angle) * self.projectile_speed
            self.projectiles.append(projectile)
            arcade.sound.play_sound(arcade.sound.load_sound("projectile.wav"))

    def restart_game(self):
        self.game_over = False
        self.kraken_hit_points = 5
        self.enemies = arcade.SpriteList()
        self.enemy_count = 0
        self.setup()
        self.player.center_x = SCREEN_WIDTH / 2
        self.player.center_y = SCREEN_HEIGHT / 2
        self.elapsed_time = 0

def main():
    game_view = KrakenGame(SCREEN_WIDTH, SCREEN_HEIGHT, "Kraken Game")
    game_view.setup()
    arcade.run()

if __name__ == "__main__":
    main()
