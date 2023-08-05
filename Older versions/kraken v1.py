import random
import arcade

class Buff:
    def __init__(self, name, icon, duration, power_modifier, speed_modifier):
        self.name = name
        self.icon = icon
        self.duration = duration
        self.power_modifier = power_modifier
        self.speed_modifier = speed_modifier

class Enemy(arcade.Sprite):
    def __init__(self, image, scale, hit_points, xp_reward):
        super().__init__(image, scale)
        self.hit_points = hit_points
        self.xp_reward = xp_reward
        self.change_x = 0
        self.change_y = 0
        self.speed = 2

    def update(self):
        self.center_x += self.change_x
        self.center_y += self.change_y

        # Verifica se o inimigo saiu da tela
        if self.center_x < -self.width or self.center_x > SCREEN_WIDTH + self.width \
                or self.center_y < -self.height or self.center_y > SCREEN_HEIGHT + self.height:
            self.respawn()

    def respawn(self):
        # Define o número de hits necessários para derrotar o inimigo
        self.hits_left = self.hit_points
        # Define uma posição aleatória fora da tela para o inimigo respawnar
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
    enemy_textures = []
    for enemy_info in enemy_info_list:
        enemy_texture = arcade.load_texture(enemy_info['image'])
        enemy_texture.scale = enemy_info['scale']
        enemy_textures.append(enemy_texture)
    return enemy_textures

def get_enemy_info(enemy_type):
    for enemy in enemy_info_list:
        if enemy_type in enemy['image']:
            return enemy

def load_player_texture():
    player_texture = arcade.load_texture("kraken.png")
    player_texture.scale = 0.01
    return player_texture

class KrakenGame(arcade.Window):
    def __init__(self, width, height, title):
        super().__init__(width, height, title)
        self.projectiles = arcade.SpriteList()
        self.projectile_speed = 5
        self.kraken_hit_points = 5
        self.player_texture = None
        self.enemy_textures = []
        self.enemy_info_list = [
            {
                'image': 'enemy_1.png',
                'scale': 0.5,
                'hit_points': 1,
                'xp_reward': 1
            },
            {
                'image': 'enemy_2.png',
                'scale': 0.5,
                'hit_points': 2,
                'xp_reward': 2
            },
            {
                'image': 'enemy_3.png',
                'scale': 0.5,
                'hit_points': 3,
                'xp_reward': 3
            }
        ]

        self.enemies = arcade.SpriteList()
        self.max_enemies = 10
        self.enemy_speed = 2
        self.enemy_spawn_chance = {
            "enemy_type_1": 0.3,
            "enemy_type_2": 0.5,
            "enemy_type_3": 0.2
        }
        self.enemy_count = 0

        self.player_sprite = None
        self.buff_sprite = None
        self.buffs = [
            Buff("Buff 1", "buff_icon1.png", 5, 2, 1),
            Buff("Buff 2", "buff_icon2.png", 5, 1, 2),
            Buff("Buff 3", "buff_icon3.png", 5, 3, 3)
        ]

    def setup(self):
        arcade.set_background_color(arcade.color.AMAZON)
        self.player_texture = load_player_texture()
        self.player_sprite = arcade.Sprite()
        self.player_sprite.center_x = SCREEN_WIDTH / 2
        self.player_sprite.center_y = SCREEN_HEIGHT / 2
        self.player_sprite.texture = self.player_texture

        self.enemy_textures = load_enemy_textures(self.enemy_info_list)

    def on_draw(self):
        arcade.start_render()
        self.enemies.draw()
        self.player_sprite.draw()
        if self.buff_sprite:
            self.buff_sprite.draw()
        self.projectiles.draw()

    def spawn_enemies(self):
        if self.enemy_count < self.max_enemies:
            spawn_chance = random.random()
            cumulative_chance = 0
            for enemy_type in self.enemy_spawn_chance:
                cumulative_chance += self.enemy_spawn_chance[enemy_type]
                if spawn_chance < cumulative_chance:
                    self.create_enemy(enemy_type)
                    self.enemy_count += 1
                    break

    def create_enemy(self, enemy_type):
        enemy_info = self.get_enemy_info(enemy_type)
        if enemy_info is not None:
            enemy = Enemy(enemy_info['image'], enemy_info['scale'], enemy_info['hit_points'], enemy_info['xp_reward'])
            enemy.respawn()
            self.enemies.append(enemy)

    def get_enemy_info(self, enemy_type):
        for enemy in self.enemy_info_list:
            if enemy_type in enemy['image']:
                return enemy
        return None

    def update_enemies(self):
        self.enemies.update()

    def check_collision(self):
        for projectile in self.projectiles:
            hit_list = arcade.check_for_collision_with_list(projectile, self.enemies)
            if hit_list:
                projectile.remove_from_sprite_lists()
                for enemy in hit_list:
                    enemy.remove_from_sprite_lists()
                self.kraken_hit_points -= 1
                if self.kraken_hit_points <= 0:
                    print("Busted")
        if self.buff_sprite and arcade.check_for_collision(self.player_sprite, self.buff_sprite):
            self.activate_buff()
            self.buff_sprite.remove_from_sprite_lists()

    def activate_buff(self):
        buff = self.generate_random_buff()
        print(f"Buff Acquired: {buff.name}")
        # Atualizar os atributos do jogador com base no buff
        self.player_sprite.power += buff.power_modifier
        self.player_sprite.speed += buff.speed_modifier
        # Definir a duração do buff
        arcade.schedule(self.update_buff, buff.duration)

    def generate_random_buff(self):
        buff = random.choice(self.buffs)
        buff_sprite = arcade.Sprite(buff.icon)
        buff_sprite.center_x = random.randint(0, SCREEN_WIDTH)
        buff_sprite.center_y = random.randint(0, SCREEN_HEIGHT)
        self.buff_sprite = buff_sprite
        return buff

    def on_update(self, delta_time):
        self.spawn_enemies()
        self.update_enemies()
        self.update_projectiles()
        self.check_collision()

    def update_buff(self, delta_time):
        print("Buff Expired")
        # Reverter os efeitos do buff
        buff = self.buffs[0]  # Supondo que o primeiro buff da lista seja o ativo
        self.player_sprite.power -= buff.power_modifier
        self.player_sprite.speed -= buff.speed_modifier

    def on_key_press(self, key, modifiers):
        if key == arcade.key.LEFT or key == arcade.key.A:
            self.player_sprite.change_x = -self.player_sprite.speed
        elif key == arcade.key.RIGHT or key == arcade.key.D:
            self.player_sprite.change_x = self.player_sprite.speed
        elif key == arcade.key.UP or key == arcade.key.W:
            self.player_sprite.change_y = self.player_sprite.speed
        elif key == arcade.key.DOWN or key == arcade.key.S:
            self.player_sprite.change_y = -self.player_sprite.speed
        elif key == arcade.key.SPACE:
            self.fire_projectile()

    def on_key_release(self, key, modifiers):
        if key == arcade.key.LEFT or key == arcade.key.RIGHT or key == arcade.key.A or key == arcade.key.D:
            self.player_sprite.change_x = 0
        elif key == arcade.key.UP or key == arcade.key.DOWN or key == arcade.key.W or key == arcade.key.S:
            self.player_sprite.change_y = 0

    def fire_projectile(self):
        projectile = arcade.Sprite("projectile.png", 0.5)
        projectile.center_x = self.player_sprite.center_x
        projectile.center_y = self.player_sprite.center_y
        projectile.change_y = self.projectile_speed
        self.projectiles.append(projectile)

    def update_projectiles(self):
        self.projectiles.update()

SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
window = KrakenGame(SCREEN_WIDTH, SCREEN_HEIGHT, "Kraken Game")
window.setup()
arcade.run()
