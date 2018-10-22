CREATE TABLE tasks (
    id serial primary key,
    task varchar(80) not null,
    time_to_complete varchar(20) not null,
    completion_status text not null, 
    notes text
);

INSERT INTO tasks (task, time_to_complete, completion_status, notes) VALUES ('Create to-do app', '8 hours', 'Not yet...', 'setup is mostly finished, gotta start writing the logic');
INSERT INTO tasks (task, time_to_complete, completion_status, notes) VALUES ('Make some chili', 'roughly 2 hours', 'Not yet...', 'onions chopped, gotta add the turkey!');
INSERT INTO tasks (task, time_to_complete, completion_status, notes) VALUES ('Feed the cats', '60 Seconds', 'Not yet...', 'If the cats reel me in, it will take more than 60 seconds');
INSERT INTO tasks (task, time_to_complete, completion_status, notes) VALUES ('Take care of yourself', 'Always on-going', 'Not yet...', 'you''re beautiful and you deserve care =)');
INSERT INTO tasks (task, time_to_complete, completion_status, notes) VALUES ('Ponder some things', '5 Minutes', 'Not yet...', 'It can be anything, just remember to stop and smell the roses');
INSERT INTO tasks (task, time_to_complete, completion_status, notes) VALUES ('Buy groceries', '1 hour', 'Not yet...', 'I know, I know, but you gotta');
INSERT INTO tasks (task, time_to_complete, completion_status, notes) VALUES ('Submit assigment on the portal', '2 minutes', 'Not yet...', 'Don''t you dare forget this again...');
