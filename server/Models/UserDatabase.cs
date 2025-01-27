namespace FluxÆther.Data
{
    public class UserDatabase
    {
        public int Id { get; set; } // Первичный ключ
        public int UserId { get; set; } // ID пользователя
        public string DatabaseName { get; set; } // Имя базы данных
        public string ConnectionString { get; set; } // Строка подключения
    }
}